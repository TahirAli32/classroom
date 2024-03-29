import Classroom from '../../../models/Classroom'
import Assignment from '../../../models/Assignment'
import connectDb from '../../../middleware/mongoose'

const handler = async (req, res) => {
  if (req.method == 'POST') {
    try {
      const classInfo = await Classroom.findOne({ classroomSlug: req.body.classroomSlug })
      const assignments = await Assignment.find({classID: classInfo._id})
      res.send({success: assignments})
    } catch (error) {
      res.send({ error: "Something went Wrong! Please try Again Later." })
    }
  }
  else {
    res.status(404).json({ error: "Page Not Found" })
  }
}

export default connectDb(handler)