import { FaTimes, FaCalendarAlt, FaBookmark, FaRegBookmark, FaStar } from 'react-icons/fa';

interface CourseModel {
  id: number;
  title: string;
  provider: string;
  category: string;
  description: string;
  skills: string[];
  rating: number;
  price: number;
  isFree: boolean;
  startDate: string;
  duration: string;
  level: string;
  isBookmarked: boolean;
  imageUrl?: string;
}

interface CourseModalProps {
  course: CourseModel;
  onClose: () => void;
  onBookmark: (id: number) => void;
}

const CourseModal = ({ course, onClose, onBookmark }: CourseModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
            <p className="text-gray-600">{course.provider}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {course.category}
            </span>
            <button 
              onClick={() => onBookmark(course.id)}
              className="text-gray-400 hover:text-yellow-500"
            >
              {course.isBookmarked ? (
                <FaBookmark className="w-5 h-5 text-yellow-500" />
              ) : (
                <FaRegBookmark className="w-5 h-5" />
              )}
            </button>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
            <p className="mt-2 text-gray-700">{course.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">Skills</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {course.skills.map((skill: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Course Details</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center text-gray-700">
                  <FaCalendarAlt className="mr-2 text-gray-500" />
                  <span>Starts: {course.startDate}</span>
                </div>
                <div className="flex items-center mt-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < Math.round(course.rating) ? 'text-yellow-400' : 'text-gray-300'} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {course.rating.toFixed(1)}
                  </span>
                </div>
                <div className="text-gray-700">
                  <span>Level: {course.level}</span>
                </div>
                <div className="text-lg font-semibold">
                  {course.isFree ? 'Free' : `$${course.price}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;
