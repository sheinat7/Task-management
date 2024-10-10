const { google } = require('googleapis');
const User = require("../models/User");
const Task = require("../models/Task");

const OAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Helper function to set up OAuth client
const setupOAuth2Client = (user) => {
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken
  });

  return oauth2Client;
};

// 1. Sync Task to Google Calendar
exports.syncTaskToCalendar = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId).populate('user');
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const user = task.user;
    if (!user.googleAccessToken) {
      return res.status(400).json({ error: 'Google Calendar is not linked' });
    }

    const oauth2Client = setupOAuth2Client(user);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: task.title,
      description: task.description,
      start: {
        dateTime: task.dueDate.toISOString(),
        timeZone: 'UTC'
      },
      end: {
        dateTime: new Date(task.dueDate.getTime() + 60 * 60 * 1000).toISOString(), // Task duration 1 hour
        timeZone: 'UTC'
      },
    };

    // Insert event into Google Calendar
    const { data } = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    task.calendarEventId = data.id;
    await task.save();

    res.json({ task, message: 'Task synced with Google Calendar successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error, unable to sync task to Google Calendar' });
  }
};


exports.updateCalendarEvent = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId).populate('user');
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const user = task.user;
    if (!task.calendarEventId) {
      return res.status(400).json({ error: 'Task is not synced with Google Calendar' });
    }

    const oauth2Client = setupOAuth2Client(user);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: task.title,
      description: task.description,
      start: {
        dateTime: task.dueDate.toISOString(),
        timeZone: 'UTC'
      },
      end: {
        dateTime: new Date(task.dueDate.getTime() + 60 * 60 * 1000).toISOString(), // Task duration 1 hour
        timeZone: 'UTC'
      }
    };

    await calendar.events.update({
      calendarId: 'primary',
      eventId: task.calendarEventId,
      resource: event
    });

    res.json({ task, message: 'Task updated in Google Calendar successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error, unable to update calendar event' });
  }
};


exports.deleteCalendarEvent = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId).populate('user');
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const user = task.user;
    if (!task.calendarEventId) {
      return res.status(400).json({ error: 'Task is not synced with Google Calendar' });
    }

    const oauth2Client = setupOAuth2Client(user);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: task.calendarEventId
    });

    task.calendarEventId = null;
    await task.save();

    res.json({ task, message: 'Task deleted from Google Calendar successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error, unable to delete calendar event' });
  }
};

// 4. OAuth2 Callback for Google Calendar Authentication
exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await OAuth2Client.getToken(code);

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.googleAccessToken = tokens.access_token;
    user.googleRefreshToken = tokens.refresh_token;
    await user.save();

    res.json({ message: 'Google Calendar linked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during Google authentication' });
  }
};

// 5. Generate Google Calendar Auth URL
exports.getGoogleAuthURL = (req, res) => {
  const authUrl = OAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });

  res.json({ url: authUrl });
};

