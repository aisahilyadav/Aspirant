import { User } from '../model/user.model.js';

export const getSettings = async (req, res) => {
  try {
    const userId = req.userID;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize default settings if missing
    if (!user.studySettings) {
      user.studySettings = {
        defaultModel: 'gemini-2.5-flash',
        studyMode: 'pomodoro',
        defaultQuizQuestions: 10,
        emailNotifications: true,
        theme: 'light'
      };
      await user.save();
    }

    res.json({
      username: user.username,
      email: user.email,
      authProvider: user.authProvider,
      studySettings: user.studySettings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Failed to fetch settings', error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const userId = req.userID;
    const { defaultModel, studyMode, defaultQuizQuestions, emailNotifications, theme } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize defaults if missing
    if (!user.studySettings) {
      user.studySettings = {
        defaultModel: 'gemini-2.5-flash',
        studyMode: 'pomodoro',
        defaultQuizQuestions: 10,
        emailNotifications: true,
        theme: 'light'
      };
    }

    // Merge study settings
    user.studySettings = {
      defaultModel: defaultModel !== undefined ? defaultModel : user.studySettings.defaultModel,
      studyMode: studyMode !== undefined ? studyMode : user.studySettings.studyMode,
      defaultQuizQuestions: defaultQuizQuestions !== undefined ? parseInt(defaultQuizQuestions) : user.studySettings.defaultQuizQuestions,
      emailNotifications: emailNotifications !== undefined ? emailNotifications : user.studySettings.emailNotifications,
      theme: theme !== undefined ? theme : user.studySettings.theme
    };

    await user.save();

    res.json({
      message: 'Settings updated successfully',
      studySettings: user.studySettings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Failed to update settings', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userID;
    const { username, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update username if provided
    if (username) {
      user.username = username;
    }

    // Update password if provided
    if (newPassword) {
      if (user.authProvider === 'google') {
        return res.status(400).json({ message: 'Google authenticated accounts cannot change password locally.' });
      }
      
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password.' });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password.' });
      }

      user.password = newPassword; // Mongoose pre-save hook will hash it!
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      username: user.username
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};
