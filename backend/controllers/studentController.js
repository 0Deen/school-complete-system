const studentModel = require('../models/student');
const { Op } = require('sequelize');
const Class = require('../models/class');
const Stream = require('../models/Stream');
const Block = require('../models/block');
const Fee = require('../models/fees');
const term = require('../models/term');
const account = require('../models/Account');
const year = require('../models/academicYear');
const bank = require('../models/bank');
const Employee = require('../models/employee');
const category = 'Students';
const logController = require('./logController');

const studentController = {
    create:async(req,res)=>{
        try {
            const { StudentID, FirstName, LastName, ClassId, ParentPhoneNumber, Email, Gender } = req.body;

            if (!StudentID || !FirstName || !LastName || !ClassId || !ParentPhoneNumber || !Email) {
                return res.status(400).json({ message: 'All fields are required.' });
            }

            const existingStudent = await studentModel.findByPk(StudentID);
            if(existingStudent){
                return res.status(400).json({error:'A student exists with the provided student number'});
            }
            
            const Student = await studentModel.create({
                StudentID, FirstName, 
                LastName, ClassId, 
                ParentPhoneNumber, 
                Email, Status:'active',
                Gender
            });

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Add Student Record",
                target:Student.StudentID
            });

            return res.status(200).json({message:'Student Added Succesfully'});

        } catch (error) {
            console.log('An error ocurred creating a student', error);
            return res.status(500).json({error:"Internal server error"});
        }
    },
    view:async(req,res)=>{
        try {
            const {StudentID} = req.body;
            const student = await studentModel.findByPk(StudentID);
            if(!student){
                return res.status(400).json({error:'Student not found'});
            }

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View Student Record",
                target:student.StudentID
            });

            return res.status(200).json(student);
        } catch (error) {
            console.log('An error ocurred creating a student', error);
            return res.status(500).json({error:"Internal server error"});
        }
    },
    viewall:async(req,res)=>{
        try {
            const students = await studentModel.findAll();
            let { token } = req.body;

            token = JSON.parse(token).token;

    
            await logController.create({
                user_id: token,category,
                action: "View All Students Records",
                target:"All"
            });

            return res.status(200).json(students)
        } catch (error) {
            console.log('An error ocurred creating a student', error);
            return res.status(500).json({error:"Internal server error"});
        }
    },
    delete: async (req, res) => {
        try {
            const { StudentID } = req.body;

            console.log(StudentID)
            const student = await studentModel.findByPk(StudentID);
            if (!student) {
                return res.status(400).json({ error: 'Student not found' });
            }
            await student.destroy();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Delete Student Record",
                target:student.StudentID
            });

            return res.status(200).json({ message: 'Student deleted successfully' });
        } catch (error) {
            console.log('An error occurred deleting a student', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    edit: async (req, res) => {
        try {
            const { StudentID, FirstName, LastName, ClassId, ParentPhoneNumber, Email, Gender } = req.body;
            const student = await studentModel.findByPk(StudentID);
            if (!student) {
                return res.status(400).json({ error: 'Student not found' });
            }
            student.FirstName = FirstName || student.FirstName;
            student.LastName = LastName || student.LastName;
            student.ClassId = ClassId || student.ClassId;
            student.ParentPhoneNumber = ParentPhoneNumber || student.ParentPhoneNumber;
            student.Email = Email || student.Email;
            student.Gender = Gender || student.Gender;

            await student.save();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Edit Student Record",
                target:student.StudentID
            });

            return res.status(200).json({ message: 'Student updated successfully' });
        } catch (error) {
            console.log('An error occurred editing a student', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    viewAllDetailed: async (req, res) => {
        try {
            const students = await studentModel.findAll({
                include: [
                    {
                        model: Class,
                        as: 'class',
                        include: [
                            { model: Stream, as: 'stream' },
                            { model: Block, as: 'block' },
                            { model: Employee, as: 'employee' }
                        ]
                    }
                ]
            });
    
            if (!students || students.length === 0) {
                return res.status(404).json({ message: 'No students found.' });
            }

            let { token } = req.body;

            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View Detailed Student Records",
                target:"All"
            });
    
            return res.status(200).json(students);
        } catch (error) {
            console.error('An error occurred fetching detailed student list', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    viewDetailed: async (req, res) => {
        try {
            const { StudentID } = req.body;
    
            const student = await studentModel.findByPk(StudentID, {
                include: [
                    {
                        model: Class,
                        as: 'class',
                        include: [
                            { model: Stream, as: 'stream' },
                            { model: Block, as: 'block' },
                            { model: Employee, as: 'employee' }
                        ]
                    }
                ]
            });
    
            if (!student) {
                return res.status(404).json({ message: 'Student not found.' });
            }

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View Detailed Student Record",
                target:StudentID
            });
    
            return res.status(200).json(student);
        } catch (error) {
            console.error('An error occurred fetching detailed student information', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },    
    search: async (req, res) => {
        try {
            const { query } = req.body;
            if (!query) {
                return res.status(400).json({ message: 'Search query is required.' });
            }

            const students = await studentModel.findAll({
                where: {
                    [Op.or]: [
                        { FirstName: { [Op.like]: `%${query}%` } },
                        { LastName: { [Op.like]: `%${query}%` } },
                        { ClassId: { [Op.like]: `%${query}%` } },
                        { ParentPhoneNumber: { [Op.like]: `%${query}%` } },
                        { Email: { [Op.like]: `%${query}%` } },
                        { Status: { [Op.like]: `%${query}%` } }
                    ]
                }
            });

            if (students.length === 0) {
                return res.status(404).json({ message: 'No students found.' });
            }

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Search Student Record",
                target:"All"
            });

            return res.status(200).json(students);
        } catch (error) {
            console.log('An error occurred searching students', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    getCounts: async (req, res) => {
        try {
            const allStudentsCount = await studentModel.count();
            const activeStudentsCount = await studentModel.count({ where: { Status: 'active' } });
            const inactiveStudentsCount = await studentModel.count({ where: { Status: 'inactive' } });
            /* const feeDefaultersCount = await studentModel.count({ where: { FeeStatus: 'default' } }); */
    
            return res.status(200).json({
                allStudents: allStudentsCount,
                activeStudents: activeStudentsCount,
                inactiveStudents: inactiveStudentsCount,
                /* feeDefaulters: feeDefaultersCount */
            });
        } catch (error) {
            console.error('An error occurred fetching counts', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
/*     getCounts : async (req, res) => {
        try {
            // Count all students
            const allStudentsCount = await studentModel.count();
    
            // Count active students
            const activeStudentsCount = await studentModel.count({
                where: { Status: 'active' }
            });
    
            // Count inactive students
            const inactiveStudentsCount = await studentModel.count({
                where: { Status: 'inactive' }
            });
    
            // Count students added within the last month based on the `createdAt` timestamp
            const newStudentsCount = await studentModel.count({
                where: {
                    createdAt: {
                        [Op.gte]: Sequelize.literal("CURRENT_DATE - INTERVAL 1 MONTH")
                    }
                }
            });
    
            return res.status(200).json({
                allStudents: allStudentsCount,
                activeStudents: activeStudentsCount,
                inactiveStudents: inactiveStudentsCount,
                newStudents: newStudentsCount
            });
        } catch (error) {
            console.error('An error occurred fetching counts', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    } */ ,
        getFeeHistory: async (req, res) => {
            try {
                const { StudentID } = req.body;
                if (!StudentID) {
                    return res.status(400).json({ message: 'StudentID is required.' });
                }
        
                const feeHistory = await Fee.findAll({
                    where: { StudentID },
                    order: [['PaymentDate', 'DESC']],
                    include: [
                        {
                            model: studentModel,
                        },
                        {
                            model: term,
                            include: [
                                {
                                    model: year,
                                    as: 'academic_year',
                                }
                            ]
                        },
                        {
                            model: account,
                            include: [
                                {
                                    model: bank,
                                    as: 'bank',
                                }
                            ]
                        }
                    ]
                });
        
                if (feeHistory.length === 0) {
                    return res.status(404).json({ message: 'No fee history found for this student.' });
                }
        
                return res.status(200).json(feeHistory);
            } catch (error) {
                console.error('An error occurred fetching fee history:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        } 
};

module.exports = studentController;