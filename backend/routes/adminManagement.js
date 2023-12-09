const express = require('express');

const { body } = require('express-validator');

const adminManagementController = require('../controllers/adminManagement');

const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, adminManagementController.fetchAll);
router.get('/students', adminManagementController.students);
router.post('/createStudent', adminManagementController.createStudent);
router.put('/updateStudent/:id', adminManagementController.updateStudent);
router.delete('/deleteStudent/:id', adminManagementController.deleteStudent);
router.get('/visitcount', adminManagementController.visitcount);
router.get('/absences/monthly',adminManagementController.monthly);
router.get('/getallvisits',adminManagementController.getallvisits);
router.delete('/deletevisit/:id',adminManagementController.deleteVisit);
router.get('/getalldataforchart',adminManagementController.getAllDataForChart);
router.get('/getStudentsCount',adminManagementController.CountStudents);
router.post('/absences',adminManagementController.absences);
router.get('/getAbsencesCount',adminManagementController.getAbsencesCount);
router.get('/getAbsences',adminManagementController.getAbsences);



router.post('/createvisit', [
  body('nom'),
  body('prenom'),
  body('date_arrivee'),
  body('raison'),
],adminManagementController.createvisit);
router.post(
  '/',
  [
    auth,
    body('title').trim().isLength({ min: 5 }).not().isEmpty(),
    body('body').trim().isLength({ min: 10 }).not().isEmpty(),
    body('user').trim().not().isEmpty(),
  ],
  adminManagementController.postPost  
);

router.delete('/:id', auth, adminManagementController.deletePost);

module.exports = router;