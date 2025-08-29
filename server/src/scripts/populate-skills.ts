import 'dotenv/config';
import mongoose from 'mongoose';
import { Skill } from '../models/skill.model';

const sampleSkills = [
  // Technical Skills
  { name: 'javascript', category: 'Programming Languages', description: 'JavaScript programming language' },
  { name: 'typescript', category: 'Programming Languages', description: 'TypeScript programming language' },
  { name: 'python', category: 'Programming Languages', description: 'Python programming language' },
  { name: 'java', category: 'Programming Languages', description: 'Java programming language' },
  { name: 'c++', category: 'Programming Languages', description: 'C++ programming language' },
  { name: 'react', category: 'Frontend Frameworks', description: 'React JavaScript library' },
  { name: 'angular', category: 'Frontend Frameworks', description: 'Angular framework' },
  { name: 'vue.js', category: 'Frontend Frameworks', description: 'Vue.js framework' },
  { name: 'node.js', category: 'Backend Technologies', description: 'Node.js runtime environment' },
  { name: 'express.js', category: 'Backend Technologies', description: 'Express.js web framework' },
  { name: 'mongodb', category: 'Databases', description: 'MongoDB NoSQL database' },
  { name: 'postgresql', category: 'Databases', description: 'PostgreSQL relational database' },
  { name: 'mysql', category: 'Databases', description: 'MySQL relational database' },
  { name: 'html', category: 'Web Technologies', description: 'HTML markup language' },
  { name: 'css', category: 'Web Technologies', description: 'CSS styling language' },
  { name: 'sass', category: 'Web Technologies', description: 'Sass CSS preprocessor' },
  { name: 'git', category: 'Version Control', description: 'Git version control system' },
  { name: 'docker', category: 'DevOps', description: 'Docker containerization platform' },
  { name: 'kubernetes', category: 'DevOps', description: 'Kubernetes container orchestration' },
  { name: 'aws', category: 'Cloud Platforms', description: 'Amazon Web Services cloud platform' },
  { name: 'azure', category: 'Cloud Platforms', description: 'Microsoft Azure cloud platform' },
  { name: 'google cloud', category: 'Cloud Platforms', description: 'Google Cloud Platform' },

  // Design Skills
  { name: 'photoshop', category: 'Design Tools', description: 'Adobe Photoshop image editing' },
  { name: 'illustrator', category: 'Design Tools', description: 'Adobe Illustrator vector graphics' },
  { name: 'figma', category: 'Design Tools', description: 'Figma design and prototyping tool' },
  { name: 'sketch', category: 'Design Tools', description: 'Sketch digital design tool' },
  { name: 'ui/ux design', category: 'Design', description: 'User interface and user experience design' },
  { name: 'graphic design', category: 'Design', description: 'Graphic design and visual communication' },
  { name: 'web design', category: 'Design', description: 'Website design and layout' },

  // Business Skills
  { name: 'project management', category: 'Management', description: 'Project planning and execution' },
  { name: 'agile methodology', category: 'Management', description: 'Agile project management methodology' },
  { name: 'scrum', category: 'Management', description: 'Scrum framework for agile development' },
  { name: 'digital marketing', category: 'Marketing', description: 'Online marketing and promotion' },
  { name: 'social media marketing', category: 'Marketing', description: 'Social media platform marketing' },
  { name: 'content writing', category: 'Content Creation', description: 'Writing content for various media' },
  { name: 'copywriting', category: 'Content Creation', description: 'Writing persuasive marketing copy' },
  { name: 'seo', category: 'Marketing', description: 'Search engine optimization' },

  // Soft Skills
  { name: 'communication', category: 'Soft Skills', description: 'Effective verbal and written communication' },
  { name: 'teamwork', category: 'Soft Skills', description: 'Collaborative work in teams' },
  { name: 'problem solving', category: 'Soft Skills', description: 'Analytical thinking and problem resolution' },
  { name: 'leadership', category: 'Soft Skills', description: 'Leading and motivating teams' },
  { name: 'time management', category: 'Soft Skills', description: 'Efficient time and task management' },
  { name: 'critical thinking', category: 'Soft Skills', description: 'Analytical and logical thinking' },
  { name: 'creativity', category: 'Soft Skills', description: 'Creative thinking and innovation' },

  // Industry-Specific Skills
  { name: 'financial analysis', category: 'Finance', description: 'Financial data analysis and reporting' },
  { name: 'accounting', category: 'Finance', description: 'Financial record keeping and management' },
  { name: 'data analysis', category: 'Data Science', description: 'Statistical analysis of data sets' },
  { name: 'machine learning', category: 'Data Science', description: 'AI and machine learning algorithms' },
  { name: 'data visualization', category: 'Data Science', description: 'Visual representation of data' },
  { name: 'customer service', category: 'Service', description: 'Customer support and satisfaction' },
  { name: 'sales', category: 'Sales', description: 'Product and service sales techniques' },
  { name: 'research', category: 'Research', description: 'Information gathering and analysis' }
];

const populateSkills = async () => {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dypse';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing skills
    await Skill.deleteMany({});
    console.log('Cleared existing skills');

    // Insert sample skills
    const insertedSkills = await Skill.insertMany(sampleSkills);
    console.log(`Inserted ${insertedSkills.length} skills`);

    console.log('✅ Skills populated successfully!');
  } catch (error) {
    console.error('❌ Error populating skills:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
populateSkills();
