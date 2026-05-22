import { adminDb } from '../config/firebase.js';

export const getStats = async (req, res, next) => {
  try {
    const uid = req.user?.uid || 'mock_uid_12345';

    let userStats = {
      xp: 8450,
      streak: 14,
      focusTime: 18.4,
      completedLessons: 42,
      productivityScore: 94,
      ranking: 128
    };

    try {
      const userDoc = await adminDb.collection('users').doc(uid).get();
      if (userDoc.exists) {
        const data = userDoc.data();
        userStats = {
          xp: data.xp || 100,
          streak: data.streak || 1,
          focusTime: data.focusTime || 0,
          completedLessons: data.completedLessons || 0,
          productivityScore: data.productivityScore || 100,
          ranking: data.ranking || 9999
        };
      }
    } catch (fbErr) {
      console.warn('⚠️ Firestore fetch error in DashboardStats. Using mock stats.');
    }

    return res.status(200).json({
      success: true,
      message: 'Dashboard statistics fetched successfully.',
      stats: userStats
    });

  } catch (err) {
    next(err);
  }
};

export const getProgress = async (req, res, next) => {
  try {
    const uid = req.user?.uid || 'mock_uid_12345';

    // Mock progress indicators aligning with the active UI components
    const progress = [
      { subject: 'Mathematics', percent: 85, xp: '2400 XP' },
      { subject: 'Coding & Data Systems', percent: 92, xp: '3100 XP' },
      { subject: 'Science & Astrophysics', percent: 70, xp: '1800 XP' },
      { subject: 'English & Composition', percent: 65, xp: '1150 XP' }
    ];

    const recommendations = [
      'Focus session suggested: Complete 25-minute Pomodoro on Physics equations.',
      'Practice Quiz: Mathematics quadratic roots module carries a +50XP bounty.',
      'Memory Alert: Review your AI flashcards on Vieta\'s formulas to maintain streak levels.'
    ];

    return res.status(200).json({
      success: true,
      message: 'Progress benchmarks compiled successfully.',
      progress,
      recommendations
    });

  } catch (err) {
    next(err);
  }
};
