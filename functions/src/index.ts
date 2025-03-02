import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';
import axios from 'axios';
import cors from 'cors';
import { formatDistanceToNow } from 'date-fns';

admin.initializeApp();
const corsHandler = cors({ origin: true });

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// Payment webhook handler
export const handlePaymentWebhook = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      const { transactionId, status, amount, songId, userId } = req.body;

      // Update transaction status
      await admin.firestore().collection('transactions').doc(transactionId).update({
        status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      if (status === 'completed') {
        // Update song stats
        await admin.firestore().collection('songs').doc(songId).update({
          downloadCount: admin.firestore.FieldValue.increment(1),
          revenue: admin.firestore.FieldValue.increment(amount)
        });

        // Send confirmation email
        const user = await admin.firestore().collection('users').doc(userId).get();
        const song = await admin.firestore().collection('songs').doc(songId).get();

        await sgMail.send({
          to: user.data()?.email,
          from: 'noreply@atekermusic.com',
          subject: 'Your Download is Ready - Ateker Music',
          html: `
            <h2>Thank you for your purchase!</h2>
            <p>Your payment of ${amount} UGX for "${song.data()?.title}" has been confirmed.</p>
            <p>You can now download your song from your library.</p>
          `
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Payment webhook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Football data sync
export const syncFootballData = functions.pubsub.schedule('every 15 minutes').onRun(async () => {
  try {
    const response = await axios.get('https://api.football-data.org/v4/matches', {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY },
      params: {
        dateFrom: new Date().toISOString().split('T')[0],
        dateTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    });

    const matches = response.data.matches;
    const batch = admin.firestore().batch();

    matches.forEach((match: any) => {
      const matchRef = admin.firestore().collection('matches').doc(match.id.toString());
      batch.set(matchRef, {
        ...match,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    });

    await batch.commit();
  } catch (error) {
    console.error('Football data sync error:', error);
  }
});

// Artist approval notification
export const onArtistApproved = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();

    if (newData.isApproved && !previousData.isApproved) {
      await sgMail.send({
        to: newData.email,
        from: 'noreply@atekermusic.com',
        subject: 'Welcome to Ateker Music - Artist Account Approved',
        html: `
          <h2>Congratulations ${newData.displayName}!</h2>
          <p>Your artist account has been approved. You can now start uploading your music.</p>
          <p>Get started by visiting your artist dashboard.</p>
        `
      });
    }
  });

// Daily revenue reports
export const generateDailyReports = functions.pubsub.schedule('every day 00:00').onRun(async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const transactions = await admin.firestore()
      .collection('transactions')
      .where('status', '==', 'completed')
      .where('createdAt', '>=', yesterday)
      .get();

    const artistRevenue = new Map();
    
    transactions.forEach(doc => {
      const data = doc.data();
      const current = artistRevenue.get(data.artistId) || 0;
      artistRevenue.set(data.artistId, current + data.amount);
    });

    for (const [artistId, revenue] of artistRevenue) {
      const artist = await admin.firestore().collection('users').doc(artistId).get();
      
      await sgMail.send({
        to: artist.data()?.email,
        from: 'noreply@atekermusic.com',
        subject: 'Daily Revenue Report - Ateker Music',
        html: `
          <h2>Daily Revenue Report</h2>
          <p>Here's your revenue summary for ${formatDistanceToNow(yesterday, { addSuffix: true })}:</p>
          <p>Total Revenue: ${revenue.toLocaleString()} UGX</p>
        `
      });
    }
  } catch (error) {
    console.error('Daily report generation error:', error);
  }
});