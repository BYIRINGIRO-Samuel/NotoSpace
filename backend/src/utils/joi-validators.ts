import Joi from 'joi';
import { body, param, query } from 'express-validator';

//users
export const userValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().when('role', {
    is: Joi.string().valid('student'),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  password: Joi.string().min(6).required(),
  role: Joi.string().required().valid("admin", "teacher", "student"),
  phone: Joi.string().required(),
  profilePicture: Joi.string()
    .uri({
      allowRelative: false,
      scheme: ["http", "https", "data"],
      allowQuerySquareBrackets: false,
    })
    .allow("")
    .optional(),
  school: Joi.string().when("role", {
    is: Joi.string().valid("teacher", "student"),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  classname: Joi.string().when("role", {
    is: "student",
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
});

export const loginValidationSchema = Joi.object({
  email: Joi.string().email(),
  phone: Joi.string(),
  password: Joi.string().min(6).required(),
  name: Joi.string().optional(),
}).or("email", "phone");

export const userForgotPasswordValidationSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const userResetPasswordValidationSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

//users - admin
export const approveSchema = Joi.object({
  username: Joi.string().required(),
  action: Joi.string().valid("approve", "reject").required(),
});


export const createStudentSchema = Joi.object({
  name: Joi.string().required().trim(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  grade: Joi.string().required(),
  rollNumber: Joi.string().required(),
  dateOfBirth: Joi.date().optional(),
  parentName: Joi.string().optional(),
  parentPhone: Joi.string().optional(),
  address: Joi.string().optional(),
  password: Joi.string().min(6).required(),
});

export const updateStudentSchema = Joi.object({
  name: Joi.string().optional().trim(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  grade: Joi.string().optional(),
  rollNumber: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  parentName: Joi.string().optional(),
  parentPhone: Joi.string().optional(),
  address: Joi.string().optional(),
  status: Joi.string().valid("active", "pending", "rejected").required(),
});

export const assignStudentToClassSchema = Joi.object({
  studentName: Joi.string().required(),
  className: Joi.string().required(),
});

export const moveStudentToClassSchema = Joi.object({
  studentName: Joi.string().required(),
  fromClassName: Joi.string().required(),
  toClassName: Joi.string().required(),
});

export const removeStudentFromClassSchema = Joi.object({
  studentName: Joi.string().required(),
  className: Joi.string().required(),
});

export const bulkAssignStudentsToClassSchema = Joi.object({
  studentNames: Joi.array().items(Joi.string()).required(),
  className: Joi.string().required(),
});

//user - teachers
export const tchrOnBoardingValidationSchema = Joi.object({
  classes: Joi.array()
    .items(
      Joi.object({
        className: Joi.string().required(),
        courseNames: Joi.array().items(Joi.string().required()).required(),
      }).required()
    )
    .required(),
});

export const assignTeacherToClassSchema = Joi.object({
  teacherName: Joi.string().required(),
  className: Joi.string().required(),
});

export const moveTeacherToClassSchema = Joi.object({
  teacherName: Joi.string().required(),
  fromClassName: Joi.string().required(),
  toClassName: Joi.string().required(),
  courseName: Joi.string().required(),
});

export const removeTeacherFromClassSchema = Joi.object({
  teacherName: Joi.string().required(),
  className: Joi.string().required(),
});

export const deleteTeacherSchema = Joi.object({
  teacherName: Joi.string().required(),
})

//school
export const schoolValidationSchema = Joi.object({
  name: Joi.string().required(),
  classes: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        courses: Joi.array().items(Joi.string().required()).required(),
        academicLevel: Joi.string()
          .valid("primary", "secondary", "college", "university", "technical")
          .required(),
      }),
    )
    .required(),
  email: Joi.string().email().optional().allow(""),
  schoolLogo: Joi.string().optional().allow(""),
});

export const updateSchoolSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  schoolLogo: Joi.string().optional().allow(""),
});

//classes
export const classValidationSchema = Joi.object({
  name: Joi.string().required(),
  courses: Joi.array().items(Joi.string().required()).required(),
  academicLevel: Joi.string().valid("primary", "secondary", "college", "university", "technical").required(),
});

export const updateClassSchema = Joi.object({
  name: Joi.string().optional(),
  academicLevel: Joi.string().valid("primary", "secondary", "college", "university", "technical").optional(),
});

//quizzes
const baseQuestionSchema = Joi.object({
  type: Joi.string().valid("multiple-choice","true-false").required(),
  question: Joi.string().required(),
  marks: Joi.number().required(),
})
const multipleChoiceSchema = baseQuestionSchema.keys({
  type: Joi.string().valid("multiple-choice").required(),
  options: Joi.array().items(Joi.string()).min(2).required(),
  answer: Joi.string().required()
});
const trueFalseSchema = baseQuestionSchema.keys({
  type: Joi.string().valid("true-false").required(),
  answer: Joi.string().valid("true", "false").required()
});

const questionSchema = Joi.alternatives().try( 
  multipleChoiceSchema, 
  trueFalseSchema,
);

export const quizValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required().valid("quiz", "assignment", "exercise"),
  questions: Joi.array().items(questionSchema).required(),
  course: Joi.string().required(),
  className: Joi.string().required(),
  submissionDate: Joi.when('type', {
    is: 'assignment', then: Joi.date().greater(Date.now() + 1000 * 60 * 60 * 4).required(),  //greater that 4hrs from now.
    otherwise: Joi.date().forbidden()
  }).messages({
    'date.greater': 'Submission date must be greater than 4 hours from now',
    'any.required': 'Submission date is required for assignments',
    'any.forbidden': 'Submission date is not allowed for quizzes and exercises'
  })
});

export const doQuizValidationSchema = Joi.object({
  questions: Joi.array().items(Joi.object({
    questionId: Joi.string().required(),
    answer: Joi.string().required(),
  })).required(),
})

export const statusValidationSchema = Joi.object({
  status: Joi.string().valid("active", "pending", "rejected").required(),
}); 

export const updateProfileValidation = [
  body('name')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters')
    .trim()
    .escape(),
  
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('confirmPassword')
    .optional()
    .custom((value, { req }) => {
      if (req.body.password && value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  
  body('storageMethod')
    .optional()
    .isIn(['gridfs', 'base64'])
    .withMessage('Storage method must be either "gridfs" or "base64"'),
];

export const userIdValidation = [
  param('userId')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID format'),
];

export const fileIdValidation = [
  param('fileId')
    .isMongoId()
    .withMessage('Invalid file ID format'),
];

export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
]; 

//notes
export const createNoteSchema = Joi.object({
  className: Joi.string().required(),
  courseName: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().optional(),
})