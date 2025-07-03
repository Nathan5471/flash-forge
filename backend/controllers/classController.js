import Class from '../models/class.js';
import User from '../models/user.js';

export const createClass = async (req, res) => {
    const { className, joinCode } = req.body;
    try {
        const existingJoinCode = await Class.findOne({ joinCode: joinCode });
        if (existingJoinCode) {
            return res.status(400).json({ message: 'Class code already exists' });
        }
        const newClass = new Class({
            teacher: req.user._id,
            className: className,
            students: [],
            joinCode: joinCode,
            assignedFlashcards: []
        });
        await newClass.save();
        req.user.classes.push(newClass._id);
        await req.user.save();
        res.status(201).json({ message: 'Class created successfully', class: newClass });
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const joinClass = async (req, res) => {
    const { classCode } = req.params;
    try {
        const classToJoin = await Class.findOne({ joinCode: classCode });
        if (!classToJoin) {
            return res.status(404).json({ message: 'Invalid join code' });
        }
        if (classToJoin.students.includes(req.user._id)) {
            return res.status(400).json({ message: 'User is already in class'});
        }
        classToJoin.students.concat(req.user._id);
        await classToJoin.save();
        res.status(200).json({ message: 'Joined calss successfully', classId: classToJoin._id })
    } catch (error) {
        console.error('Error joining class:', error);
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const leaveClass = async (req, res) => {
    const { classId } = req.params;
    try {
        const classToLeave = await Class.findById(classId);
        if (!classToLeave) {
            return res.status(404).json({ message: 'Class not found' });
        }
        if (!classToLeave.students.includes(req.user._id)) {
            if (classToLeave.teacher.toString() === req.user._id.toString()) {
                return res.status(403).json({ message: 'Teacher cannot leave class' });
            }
            return res.status(400).json({ message: 'User is not in class'});
        }
        classToLeave.students.remove(req.user._id);
        await classToLeave.save();
        res.status(200).json({ message: 'Left class successfully' });
    } catch (error) {
        console.error('Error leaving class:', error);
        res.status(500).json({ message: 'Internal server error'});
    }
}

export const deleteClass = async (req, res) => {
    const { id } = req.params;
    try {
        const classToDelete = Class.findById(id);
        if (classToDelete.teacher !== req.user._id) {
            return res.status(403).json({ message: 'You do not have permission to delete this class' })
        }
        classToDelete.students.forEach(async (studentId) => {
            const student = await User.findById(studentId);
            if (student) {
                student.classes = student.classes.filter(classId => classId.toString() !== id.toString());
                await student.save();
            }
        })
        await Class.findByIdAndDelete(id);
        res.status(200).json({ message: 'Class delete sucessfully' })
    } catch (error) {
        console.error('Error deleting class:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const assignFlashcardSet = async (req, res) => {
    const { classId } = req.params;
    const { flashcardSetId } = req.body;
    try {
        const classToUpdate = await Class.findById(classId);
        if (!classToUpdate) {
            return res.status(404).json({ message: 'Class not found' });
        }
        if (classToUpdate.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You do not have permission to assign flashcard sets to this class' });
        }
        if (classToUpdate.assignedFlashcards.includes(flashcardSetId)) {
            return res.status(400).json({ message: 'Flashcard set already assigned to class' });
        }
        classToUpdate.assignedFlashcards.push(flashcardSetId);
        await classToUpdate.save();
        res.status(200).json({ message: 'Flashcard set assigned successfully', class: classToUpdate });
    } catch (error) {
        console.error('Error assigning flashcard set:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const unassignFlashcardSet = async (req, res) => {
    const { classId } = req.params;
    const { flashcardSetId } = req.body;
    try {
        const classToUpdate = await Class.findById(classId);
        if (!classToUpdate) {
            return res.status(404).json({ message: 'Class not found' });
        }
        if (classToUpdate.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You do not have permission to unassign flashcard sets from this class' });
        }
        if (!classToUpdate.assignedFlashcards.includes(flashcardSetId)) {
            return res.status(400).json({ message: 'Flashcard set not assigned to class' });
        }
        classToUpdate.assignedFlashcards = classToUpdate.assignedFlashcards.filter(id => id.toString() !== flashcardSetId.toString());
        await classToUpdate.save();
        res.status(200).json({ message: 'Flashcard set unassigned successfully', class: classToUpdate });
    } catch (error) {
        console.error('Error unassigning flashcard set:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getClass = async (req, res) => {
    const { id } = req.params;
    try {
        const classToGet = await Class.findById(id)
        if (!classToGet) {
            return res.status(404).json({ message: 'Class not found' });
        }
        if (classToGet.teacher.toString() !== req.user._id.toString() && !classToGet.students.some(studentId => studentId.toString() === req.user._id.toString())) {
            return res.status(403).json({ message: 'You do not have permission to view this class' });
        }
        await classToGet.populate([
            { path: 'teacher', select: 'username _id' },
            { path: 'students', select: 'username _id' },
            { path: 'assignedFlashcards' }
        ])
        res.status(200).json({ class: classToGet });
    } catch (error) {
        console.error('Error getting class:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getUserClasses = async (req, res) => {
    try {
        const classes = await Promise.all(req.user.classes.map(async (classId) => {
            const classData = await Class.findById(classId);
            if (!classData) {
                return undefined;
            }
            return classData.populate([
                { path: 'teacher', select: 'username _id' },
                { path: 'students', select: 'username _id' },
                { path: 'assignedFlashcards' }
            ])
        }))
        classes.filter(classData => classData !== undefined);
        res.status(200).json({ classes });
    } catch (error) {
        console.error('Error getting user classes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}