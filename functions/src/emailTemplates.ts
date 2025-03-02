import { format } from 'date-fns';

export const emailTemplates = {
  'artist-approved': (data: any) => ({
    subject: 'Welcome to Ateker Music!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Welcome to Ateker Music!</h1>
        <p>Dear ${data.artistName},</p>
        <p>We're excited to inform you that your artist application has been approved! You are now officially part of the Ateker Music community.</p>
        
        <h2 style="color: #4F46E5; margin-top: 20px;">Next Steps:</h2>
        <ol>
          <li>Complete your artist profile</li>
          <li>Upload your music</li>
          <li>Connect with other artists</li>
        </ol>
        
        <p style="margin-top: 20px;">If you have any questions, please don't hesitate to contact our support team.</p>
        
        <p>Best regards,<br>The Ateker Music Team</p>
      </div>
    `
  }),

  'artist-rejected': (data: any) => ({
    subject: 'Artist Application Status Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Application Status Update</h1>
        <p>Dear ${data.artistName},</p>
        <p>Thank you for your interest in Ateker Music. After careful review of your application, we regret to inform you that we are unable to approve your artist application at this time.</p>
        
        <p>You are welcome to apply again in the future with updated information. We recommend:</p>
        <ul>
          <li>Adding more detailed information about your music</li>
          <li>Including high-quality sample tracks</li>
          <li>Providing a complete portfolio</li>
        </ul>
        
        <p style="margin-top: 20px;">If you have any questions about this decision, please contact our support team.</p>
        
        <p>Best regards,<br>The Ateker Music Team</p>
      </div>
    `
  }),

  'welcome-email': (data: any) => ({
    subject: 'Welcome to Ateker Music!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Welcome to Ateker Music!</h1>
        <p>Dear ${data.userName},</p>
        <p>Thank you for joining Ateker Music! We're excited to have you as part of our community.</p>
        
        <h2 style="color: #4F46E5; margin-top: 20px;">Getting Started:</h2>
        <ul>
          <li>Complete your profile</li>
          <li>Explore our music library</li>
          <li>Connect with other music lovers</li>
        </ul>
        
        <p style="margin-top: 20px;">If you have any questions, our support team is here to help!</p>
        
        <p>Best regards,<br>The Ateker Music Team</p>
      </div>
    `
  }),

  'password-reset': (data: any) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Password Reset Request</h1>
        <p>Dear ${data.userName},</p>
        <p>We received a request to reset your password. Click the link below to create a new password:</p>
        
        <p style="margin: 20px 0;">
          <a href="${data.resetLink}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </p>
        
        <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
        
        <p>Best regards,<br>The Ateker Music Team</p>
      </div>
    `
  }),

  'content-flagged': (data: any) => ({
    subject: 'Content Flagged for Review',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Content Flagged for Review</h1>
        <p>Dear Admin,</p>
        <p>A piece of content has been flagged for review:</p>
        
        <div style="background-color: #F3F4F6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Title:</strong> ${data.contentTitle}</p>
          <p><strong>Type:</strong> ${data.contentType}</p>
          <p><strong>Reported by:</strong> ${data.reportedBy}</p>
          <p><strong>Reason:</strong> ${data.reason}</p>
        </div>
        
        <p>Please review this content and take appropriate action.</p>
        
        <p>Best regards,<br>Ateker Music System</p>
      </div>
    `
  }),

  'account-suspended': (data: any) => ({
    subject: 'Account Suspension Notice',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Account Suspension Notice</h1>
        <p>Dear ${data.userName},</p>
        <p>Your Ateker Music account has been suspended due to violations of our terms of service.</p>
        
        <div style="background-color: #F3F4F6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Reason:</strong> ${data.reason}</p>
          <p><strong>Duration:</strong> ${data.duration}</p>
        </div>
        
        <p>If you believe this is a mistake or would like to appeal this decision, please contact our support team.</p>
        
        <p>Best regards,<br>The Ateker Music Team</p>
      </div>
    `
  }),

  'marketing-campaign': (data: any) => ({
    subject: data.subject || 'Special Update from Ateker Music',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">${data.title}</h1>
        <p>Dear ${data.userName},</p>
        
        ${data.content}
        
        <div style="margin: 30px 0;">
          <a href="${data.ctaLink}" style="background-color: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            ${data.ctaText}
          </a>
        </div>
        
        <p>Best regards,<br>The Ateker Music Team</p>
      </div>
    `
  }),

  'new-release': (data: any) => ({
    subject: `New Release: ${data.artistName} - ${data.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">New Release Alert!</h1>
        <p>Dear ${data.userName},</p>
        <p>${data.artistName} has just released a new track: <strong>${data.title}</strong></p>
        
        <div style="margin: 20px 0;">
          <img src="${data.coverArt}" alt="${data.title}" style="max-width: 100%; border-radius: 5px;">
        </div>
        
        <p>${data.description}</p>
        
        <div style="margin: 30px 0;">
          <a href="${data.listenLink}" style="background-color: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Listen Now
          </a>
        </div>
        
        <p>Best regards,<br>The Ateker Music Team</p>
      </div>
    `
  }),

  'weekly-digest': (data: any) => ({
    subject: 'Your Weekly Music Digest',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Your Weekly Music Digest</h1>
        <p>Dear ${data.userName},</p>
        <p>Here's what's new in your favorite genres this week:</p>
        
        ${data.genres.map(genre => `
          <div style="margin: 20px 0; padding: 15px; background-color: #F3F4F6; border-radius: 5px;">
            <h2 style="color: #4F46E5;">${genre.name}</h2>
            <ul style="list-style: none; padding: 0;">
              ${genre.tracks.map(track => `
                <li style="margin: 10px 0;">
                  <strong>${track.title}</strong> by ${track.artist}
                </li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
        
        <div style="margin: 30px 0;">
          <a href="${data.exploreLink}" style="background-color: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Explore More
          </a>
        </div>
        
        <p>Best regards,<br>The Ateker Music Team</p>
      </div>
    `
  }),

  'artist-update': (data: any) => ({
    subject: `Update from ${data.artistName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Artist Update</h1>
        <p>Dear ${data.userName},</p>
        <p>${data.artistName} has shared an update with their fans:</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #F3F4F6; border-radius: 5px;">
          ${data.message}
        </div>
        
        ${data.mediaUrl ? `
          <div style="margin: 20px 0;">
            <img src="${data.mediaUrl}" alt="Artist Update" style="max-width: 100%; border-radius: 5px;">
          </div>
        ` : ''}
        
        <div style="margin: 30px 0;">
          <a href="${data.viewLink}" style="background-color: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Update
          </a>
        </div>
        
        <p>Best regards,<br>The Ateker Music Team</p>
      </div>
    `
  }),

  'event-reminder': (data: any) => ({
    subject: `Reminder: ${data.eventTitle} is coming up!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Event Reminder</h1>
        <p>Dear ${data.userName},</p>
        <p>This is a reminder that <strong>${data.eventTitle}</strong> is coming up soon!</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #F3F4F6; border-radius: 5px;">
          <p><strong>Date:</strong> ${format(data.date, 'MMMM d, yyyy')}</p>
          <p><strong>Time:</strong> ${format(data.date, 'h:mm a')}</p>
          ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
        </div>
        
        <p>${data.description}</p>
        
        <div style="margin: 30px 0;">
          <a href="${data.eventLink}" style="background-color: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Event Details
          </a>
        </div>
        
        <p>Best regards,<br>The Ateker Music Team</p>
      </div>
    `
  }),

  'event-cancelled': (data: any) => ({
    subject: `Important: ${data.eventTitle} has been cancelled`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Event Cancellation Notice</h1>
        <p>Dear ${data.userName},</p>
        <p>We regret to inform you that <strong>${data.eventTitle}</strong> has been cancelled.</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #F3F4F6; border-radius: 5px;">
          <p><strong>Original Date:</strong> ${format(data.date, 'MMMM d, yyyy')}</p>
          <p><strong>Reason:</strong> ${data.reason}</p>
        </div>
        
        ${data.rescheduledDate ? `
          <p>We are pleased to inform you that the event has been rescheduled to:</p>
          <p><strong>${format(data.rescheduledDate, 'MMMM d, yyyy')}</strong></p>
        ` : ''}
        
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        
        <p>Best regards,<br>The Ateker Music Team</p>
      </div>
    `
  }),

  'event-update': (data: any) => ({
    subject: `Update: ${data.eventTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Event Update</h1>
        <p>Dear ${data.userName},</p>
        <p>There has been an update regarding <strong>${data.eventTitle}</strong>:</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #F3F4F6; border-radius: 5px;">
          ${data.changes.map(change => `
            <p><strong>${change.field}:</strong> ${change.newValue}</p>
          `).join('')}
        </div>
        
        <p>${data.message}</p>
        
        <div style="margin: 30px 0;">
          <a href="${data.eventLink}" style="background-color: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Updated Event Details
          </a>
        </div>
        
        <p>Best regards,<br>The Ateker Music Team</p>
      </div>
    `
  }),

  'personalized-recommendations': (data: any) => ({
    subject: 'Your Personalized Music Recommendations',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Your Personalized Music Recommendations</h1>
        <p>Dear ${data.userName},</p>
        <p>Based on your listening history and preferences, here are some tracks we think you'll love:</p>
        
        ${data.recommendations.map((track: any) => `
          <div style="margin: 20px 0; padding: 15px; background-color: #F3F4F6; border-radius: 5px;">
            <h3 style="color: #4F46E5;">${track.title}</h3>
            <p>by ${track.artist}</p>
            <p style="color: #6B7280;">${track.genre}</p>
            <p>${track.description}</p>
            <div style="margin-top: 10px;">
              <a href="${track.listenLink}" style="background-color: #4F46E5; color: white; padding: 8px 16px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Listen Now
              </a>
            </div>
          </div>
        `).join('')}
        
        <p>Want more recommendations? Check out our full collection:</p>
        <div style="margin: 30px 0;">
          <a href="${data.exploreLink}" style="background-color: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Explore More
          </a>
        </div>
        
        <p>Best regards,<br>The Ateker Music Team</p>
      </div>
    `
  }),

  'similar-artists': (data: any) => ({
    subject: `Artists Similar to ${data.favoriteArtist}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Discover Similar Artists</h1>
        <p>Dear ${data.userName},</p>
        <p>Since you enjoy ${data.favoriteArtist}, we think you might like these artists:</p>
        
        ${data.similarArtists.map((artist: any) => `
          <div style="margin: 20px 0; padding: 15px; background-color: #F3F4F6; border-radius: 5px;">
            <h3 style="color: #4F46E5;">${artist.name}</h3>
            <p style="color: #6B7280;">${artist.genre}</p>
            <p>${artist.description}</p>
            <div style="margin-top: 10px;">
              <a href="${artist.profileLink}" style="background-color: #4F46E5; color: white; padding: 8px 16px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Profile
              </a>
            </div>
          </div>
        `).join('')}
        
        <p>Want to discover more artists?</p>
        <div style="margin: 30px 0;">
          <a href="${data.exploreLink}" style="background-color: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Explore More Artists
          </a>
        </div>
        
        <p>Best regards,<br>The Ateker Music Team</p>
      </div>
    `
  }),

  'genre-discovery': (data: any) => ({
    subject: 'Explore New Genres You Might Like',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Discover New Genres</h1>
        <p>Dear ${data.userName},</p>
        <p>Based on your listening preferences, here are some genres you might enjoy exploring:</p>
        
        ${data.genres.map((genre: any) => `
          <div style="margin: 20px 0; padding: 15px; background-color: #F3F4F6; border-radius: 5px;">
            <h3 style="color: #4F46E5;">${genre.name}</h3>
            <p>${genre.description}</p>
            <p>Popular tracks in this genre:</p>
            <ul style="list-style: none; padding: 0;">
              ${genre.popularTracks.map((track: any) => `
                <li style="margin: 10px 0;">
                  <strong>${track.title}</strong> by ${track.artist}
                </li>
              `).join('')}
            </ul>
            <div style="margin-top: 10px;">
              <a href="${genre.exploreLink}" style="background-color: #4F46E5; color: white; padding: 8px 16px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Explore Genre
              </a>
            </div>
          </div>
        `).join('')}
        
        <p>Want to discover more genres?</p>
        <div style="margin: 30px 0;">
          <a href="${data.exploreLink}" style="background-color: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Explore All Genres
          </a>
        </div>
        
        <p>Best regards,<br>The Ateker Music Team</p>
      </div>
    `
  })
}; 