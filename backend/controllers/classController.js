import Class from '../models/class.js';

export const createClass = async (req, res) => {
    const { className } = req.body;
    try {
        const newClass = new Class({
            teacher: req.user._id,
            className: className,
            students: [],
        });
        await newClass.save();
        res.status(201).json({ message: 'Class created successfully', class: newClass });
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const joinClass = async (req, res) => {
    const { classId } = req.body;
    try {
        const classToJoin = Class.findById(classId);
        if (classToJoin.students.contains(req.user._id)) {
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
    const { classId } = req.body;
    try {
        const classToLeave = Class.findById(classId);
        if (!classToJoin.students.contains(req.user._id)) {
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
        await Class.findByIdAndDelete(id);
        res.status(200).json({ message: 'Class delete sucessfully' })
    } catch (error) {
        console.error('Error deleting class:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}