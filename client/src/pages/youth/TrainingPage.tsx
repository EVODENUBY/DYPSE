import { useState, useEffect, useRef } from 'react';
import { FaBookmark, FaRegBookmark, FaStar } from 'react-icons/fa';
import { FiChevronDown, FiSearch, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import CourseModal from '@/components/modals/CourseModal';

interface TrainingCourse {
  id: number;
  title: string;
  provider: string;
  duration: string;
  level: string;
  rating: number;
  isBookmarked: boolean;
  image: string;
  category: string;
  price: number;
  isFree: boolean;
  startDate: string;
  skills: string[];
  description: string;
}

const TrainingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedSort, setSelectedSort] = useState('Most Popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState({ category: false, level: false, sort: false });
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);
  const coursesPerPage = 6;
  const [currentCourses, setCurrentCourses] = useState<TrainingCourse[]>([]);
  const [courses, setCourses] = useState<TrainingCourse[]>([
    {
      id: 1,
      title: 'Web Development Bootcamp',
      provider: 'Tech Academy',
      duration: '12 weeks',
      level: 'Beginner',
      rating: 4.8,
      isBookmarked: false,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      category: 'Technology',
      price: 0,
      isFree: true,
      startDate: '2025-10-15',
      skills: ['HTML', 'CSS', 'JavaScript', 'React'],
      description: 'A comprehensive bootcamp covering modern web development technologies and best practices.'
    },
    {
      id: 2,
      title: 'Digital Marketing Mastery',
      provider: 'Marketing Pro',
      duration: '8 weeks',
      level: 'Intermediate',
      rating: 4.6,
      isBookmarked: false,
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      category: 'Marketing',
      price: 0,
      isFree: true,
      startDate: '2025-09-01',
      skills: ['SEO', 'Social Media', 'Content Marketing', 'Analytics'],
      description: 'Master digital marketing strategies and tools to grow your online presence.'
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      provider: 'Design Hub',
      duration: '10 weeks',
      level: 'Beginner',
      rating: 4.7,
      isBookmarked: false,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      category: 'Design',
      price: 0,
      isFree: true,
      startDate: '2025-10-20',
      skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping'],
      description: 'Learn the principles of user interface and experience design.'
    },
    {
      id: 4,
      title: 'Business Analytics',
      provider: 'Data Insights',
      duration: '14 weeks',
      level: 'Advanced',
      rating: 4.9,
      isBookmarked: false,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      category: 'Business',
      price: 0,
      isFree: true,
      startDate: '2025-11-10',
      skills: ['Excel', 'SQL', 'Data Visualization', 'Statistics'],
      description: 'Transform data into actionable business insights with advanced analytics.'
    }
  ]);
  
  const [filteredCourses, setFilteredCourses] = useState<TrainingCourse[]>([]);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const sortOptions = ['Most Popular', 'Newest', 'Highest Rated'];
  
  // Initialize filteredCourses with courses on first render
  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);
  const categories = ['All Categories', 'Technology', 'Business', 'Design', 'Marketing'];
  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    console.log('Courses:', courses);
    // Filter courses
    const filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.provider.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All Levels' || course.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    });

    // Sort courses
    const sorted = [...filtered].sort((a, b) => {
      switch (selectedSort) {
        case 'Newest': return b.id - a.id;
        case 'Highest Rated': return b.rating - a.rating;
        case 'Price: Low to High': return a.price - b.price;
        default: return b.rating - a.rating; // Most Popular
      }
    });

    console.log('Filtered and sorted courses:', sorted);
    setFilteredCourses(sorted);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLevel, selectedSort, courses]);

  useEffect(() => {
    // Pagination
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const current = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
    console.log('Current courses to display:', current);
    setCurrentCourses(current);
  }, [currentPage, filteredCourses, coursesPerPage]);

  const toggleBookmark = (id: number) => {
    const updatedCourses = courses.map(course => 
      course.id === id ? { ...course, isBookmarked: !course.isBookmarked } : course
    );
    setCourses(updatedCourses);
    
    // Update the selected course if it's currently being viewed
    if (selectedCourse && selectedCourse.id === id) {
      setSelectedCourse({
        ...selectedCourse,
        isBookmarked: !selectedCourse.isBookmarked
      });
    }
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close dropdowns when clicking outside
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown({ category: false, level: false, sort: false });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (type: 'category' | 'level' | 'sort', e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowDropdown({
      category: type === 'category' ? !showDropdown.category : false,
      level: type === 'level' ? !showDropdown.level : false,
      sort: type === 'sort' ? !showDropdown.sort : false,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Training & Courses</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => toggleDropdown('category', e)}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 w-full md:w-auto justify-between min-w-[160px]"
            >
              <span>{selectedCategory}</span>
              <FiChevronDown className={`transition-transform ${showDropdown.category ? 'transform rotate-180' : ''}`} />
            </button>
            {showDropdown.category && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg py-1 border">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(category);
                      setShowDropdown({ ...showDropdown, category: false });
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      selectedCategory === category ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Level Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => toggleDropdown('level', e)}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 w-full md:w-auto justify-between min-w-[140px]"
            >
              <span>{selectedLevel}</span>
              <FiChevronDown className={`transition-transform ${showDropdown.level ? 'transform rotate-180' : ''}`} />
            </button>
            {showDropdown.level && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg py-1 border">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLevel(level);
                      setShowDropdown({ ...showDropdown, level: false });
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      selectedLevel === level ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => toggleDropdown('sort', e)}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 w-full md:w-auto justify-between min-w-[160px]"
            >
              <span>Sort: {selectedSort}</span>
              <FiChevronDown className={`transition-transform ${showDropdown.sort ? 'transform rotate-180' : ''}`} />
            </button>
            {showDropdown.sort && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg py-1 border">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSort(option);
                      setShowDropdown({ ...showDropdown, sort: false });
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      selectedSort === option ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentCourses.length > 0 ? (
          currentCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full">
              <div className="relative">
                <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                <button
                  onClick={() => toggleBookmark(course.id)}
                  className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full"
                >
                  {course.isBookmarked ? <FaBookmark className="text-blue-600" /> : <FaRegBookmark />}
                </button>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex-grow">
                  <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{course.provider}</p>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.round(course.rating) ? 'text-yellow-400' : 'text-gray-300'} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">({course.rating.toFixed(1)})</span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex">
                      <span className="font-medium min-w-[60px]">Starts:</span>
                      <span>{new Date(course.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium min-w-[60px]">Duration:</span>
                      <span>{course.duration}</span>
                    </div>
                    <div>
                      <span className="font-medium">Skills:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {course.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Enrolling in ${course.title}`);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                    >
                      Enroll
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCourse(course);
                      }}
                      className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                    >
                      View
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Requesting info for ${course.title}`);
                      }}
                      className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                    >
                      Info
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500">No courses found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Course Modal */}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onBookmark={toggleBookmark}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-1" aria-label="Pagination">
            <button
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show first page, last page, and pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default TrainingPage;
