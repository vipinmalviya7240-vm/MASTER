import { adminDb } from '../config/firebase.js';

export const getProfile = async (req, res, next) => {
  try {
    const uid = req.user.uid;

    const userDoc = await adminDb.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found.'
      });
    }

    return res.status(200).json({
      success: true,
      user: userDoc.data()
    });

  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const { username, email } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    updateData.updatedAt = new Date().toISOString();

    await adminDb.collection('users').doc(uid).update(updateData);

    const updatedDoc = await adminDb.collection('users').doc(uid).get();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedDoc.data()
    });

  } catch (err) {
    next(err);
  }
};
