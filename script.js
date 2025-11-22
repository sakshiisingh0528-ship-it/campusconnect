// Global variables
let currentUser = null;
let currentRole = 'student';
let isLoggedIn = false;

// DOM elements
const loginScreen = document.getElementById('loginScreen');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const roleButtons = document.querySelectorAll('.role-btn');
const navItems = document.querySelectorAll('.nav-item');
const studentDashboard = document.getElementById('studentDashboard');
const teacherDashboard = document.getElementById('teacherDashboard');
const chatbot = document.getElementById('chatbot');
const chatbotBtn = document.getElementById('chatbotBtn');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const profileModal = document.getElementById('profileModal');
const profileClose = document.getElementById('profileClose');
const logoutBtn = document.getElementById('logoutBtn');

// Sample data
const sampleData = {
    students: {
        'student1': { password: '123', name: 'John Doe', role: 'student', email: 'john.doe@school.edu', id: '2023001' },
        'student2': { password: '123', name: 'Alice Johnson', role: 'student', email: 'alice.johnson@school.edu', id: '2023002' },
        'student3': { password: '123', name: 'Bob Smith', role: 'student', email: 'bob.smith@school.edu', id: '2023003' }
    },
    teachers: {
        'teacher1': { password: '123', name: 'Dr. Sarah Wilson', role: 'teacher', email: 'sarah.wilson@school.edu', id: 'T2023001' },
        'teacher2': { password: '123', name: 'Prof. Michael Brown', role: 'teacher', email: 'michael.brown@school.edu', id: 'T2023002' }
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    initializeCharts();
});

function initializeApp() {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        currentRole = currentUser.role;
        isLoggedIn = true;
        showMainApp();
    } else {
        showLoginScreen();
    }
}

function setupEventListeners() {
    // Role selection
    roleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            roleButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentRole = this.dataset.role;
        });
    });

    // Login form
    loginForm.addEventListener('submit', handleLogin);

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            if (section) {
                showSection(section);
                updateNavigation(this);
            }
        });
    });

    // Chatbot
    chatbotBtn.addEventListener('click', toggleChatbot);
    chatbotClose.addEventListener('click', toggleChatbot);
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Profile modal
    document.querySelectorAll('[data-section="profile"]').forEach(btn => {
        btn.addEventListener('click', showProfileModal);
    });
    profileClose.addEventListener('click', hideProfileModal);

    // Logout
    logoutBtn.addEventListener('click', handleLogout);

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === profileModal) {
            hideProfileModal();
        }
    });
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check credentials - support both username and email
    let userData = null;
    const users = sampleData[currentRole + 's'];
    
    // First try to find by username
    if (users[username]) {
        userData = users[username];
    } else {
        // If not found by username, search by email
        for (const key in users) {
            if (users[key].email === username) {
                userData = users[key];
                break;
            }
        }
    }

    if (userData && userData.password === password) {
        currentUser = userData;
        isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainApp();
    } else {
        alert('Invalid credentials. Please try again.\n\nValid credentials:\nStudents: student1, student2, student3 (or use their emails)\nTeachers: teacher1, teacher2 (or use their emails)');
    }
}

function showLoginScreen() {
    loginScreen.classList.remove('hidden');
    mainApp.classList.add('hidden');
}

function showMainApp() {
    loginScreen.classList.add('hidden');
    mainApp.classList.remove('hidden');
    updateUserInfo();
    showDashboard();
}

function updateUserInfo() {
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userRole').textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileRole').textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileId').textContent = `ID: ${currentUser.id}`;
}

function showDashboard() {
    if (currentRole === 'student') {
        studentDashboard.classList.remove('hidden');
        teacherDashboard.classList.add('hidden');
    } else {
        studentDashboard.classList.add('hidden');
        teacherDashboard.classList.remove('hidden');
    }
}

function showSection(section) {
    if (section === 'dashboard') {
        showDashboard();
    } else if (section === 'attendance') {
        showAttendanceSection();
    } else if (section === 'tests') {
        showTestsSection();
    } else if (section === 'profile') {
        showProfileModal();
    }
}

function showAttendanceSection() {
    // This would show detailed attendance information
    alert('Attendance section - Detailed view would be implemented here');
}

function showTestsSection() {
    // This would show detailed test information
    alert('Tests section - Detailed view would be implemented here');
}

function updateNavigation(activeItem) {
    navItems.forEach(item => item.classList.remove('active'));
    activeItem.classList.add('active');
}

function toggleChatbot() {
    chatbot.classList.toggle('hidden');
    if (!chatbot.classList.contains('hidden')) {
        chatbotInput.focus();
    }
}

function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message) {
        addMessage(message, 'user');
        chatbotInput.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const response = generateAIResponse(message);
            addMessage(response, 'bot');
        }, 1000);
    }
}

function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    if (sender === 'bot') {
        messageContent.innerHTML = `<i class="fas fa-robot"></i><p>${content}</p>`;
    } else {
        messageContent.innerHTML = `<p>${content}</p>`;
    }
    
    messageDiv.appendChild(messageContent);
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function generateAIResponse(message) {
    const responses = {
        greeting: [
            "Hello! How can I help you today?",
            "Hi there! What can I assist you with?",
            "Good to see you! How may I help?"
        ],
        attendance: [
            "Your current attendance is 85%. You need to maintain at least 75% to be eligible for exams.",
            "You have 3 absences this month. Make sure to attend all classes to maintain good attendance.",
            "Your attendance record looks good! Keep it up!"
        ],
        grades: [
            "Your latest test scores show improvement in Mathematics. Keep studying hard!",
            "You're performing well in most subjects. Focus on areas where you can improve.",
            "Your overall academic performance is good. Continue with your current study routine."
        ],
        timetable: [
            "Your next class is Mathematics at 9:00 AM in Room 201.",
            "You have Physics lab at 2:00 PM today. Don't forget your lab coat!",
            "Tomorrow you have Chemistry test. Make sure to revise the periodic table."
        ],
        fees: [
            "Your tuition fee is paid. Exam fee payment is pending. Please pay before the deadline.",
            "All your fees are up to date. No pending payments.",
            "You have a late fee of $50 for the library fee. Please pay as soon as possible."
        ],
        default: [
            "I understand you're asking about that. Let me help you find the right information.",
            "That's a great question! Let me provide you with some guidance.",
            "I'm here to help with any questions you might have about your studies."
        ]
    };

    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    } else if (lowerMessage.includes('attendance')) {
        return responses.attendance[Math.floor(Math.random() * responses.attendance.length)];
    } else if (lowerMessage.includes('grade') || lowerMessage.includes('score') || lowerMessage.includes('mark')) {
        return responses.grades[Math.floor(Math.random() * responses.grades.length)];
    } else if (lowerMessage.includes('timetable') || lowerMessage.includes('schedule') || lowerMessage.includes('class')) {
        return responses.timetable[Math.floor(Math.random() * responses.timetable.length)];
    } else if (lowerMessage.includes('fee') || lowerMessage.includes('payment')) {
        return responses.fees[Math.floor(Math.random() * responses.fees.length)];
    } else {
        return responses.default[Math.floor(Math.random() * responses.default.length)];
    }
}

function showProfileModal() {
    profileModal.classList.remove('hidden');
}

function hideProfileModal() {
    profileModal.classList.add('hidden');
}

function handleLogout() {
    currentUser = null;
    isLoggedIn = false;
    localStorage.removeItem('currentUser');
    showLoginScreen();
    document.getElementById('loginForm').reset();
}

function initializeCharts() {
    // Initialize attendance chart
    const attendanceCtx = document.getElementById('attendanceChart');
    if (attendanceCtx) {
        new Chart(attendanceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Present', 'Absent'],
                datasets: [{
                    data: [85, 15],
                    backgroundColor: ['#28a745', '#dc3545'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Initialize progress chart
    const progressCtx = document.getElementById('progressChart');
    if (progressCtx) {
        new Chart(progressCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                datasets: [{
                    label: 'Mathematics',
                    data: [75, 78, 82, 80, 85, 88],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Physics',
                    data: [70, 72, 75, 78, 80, 82],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Chemistry',
                    data: [68, 70, 72, 75, 77, 80],
                    borderColor: '#ffc107',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }
}

// Additional utility functions
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

function formatTime(time) {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(time);
}

// Sample data for dynamic content
const sampleEvents = [
    {
        title: "Parent-Teacher Meeting",
        date: new Date(2024, 11, 15),
        time: "2:00 PM",
        location: "Conference Room"
    },
    {
        title: "Science Fair",
        date: new Date(2024, 11, 20),
        time: "10:00 AM",
        location: "Auditorium"
    },
    {
        title: "Holiday Break",
        date: new Date(2024, 11, 25),
        time: "All Day",
        location: "School Closed"
    }
];

const sampleLectures = [
    {
        time: "9:00 AM",
        subject: "Mathematics",
        class: "12A",
        room: "201",
        topic: "Calculus"
    },
    {
        time: "10:30 AM",
        subject: "Physics",
        class: "12B",
        room: "205",
        topic: "Mechanics"
    },
    {
        time: "12:00 PM",
        subject: "Mathematics",
        class: "11A",
        room: "201",
        topic: "Algebra"
    }
];

// Detailed Dashboard Functions
function showAttendanceDetails() {
    alert('Detailed attendance view would open here with:\n- Monthly calendar view\n- Subject-wise breakdown\n- Attendance trends\n- Absence reasons\n- Make-up class options');
}

function filterPYQ(subject) {
    const pyqItems = document.querySelectorAll('.pyq-item');
    pyqItems.forEach(item => {
        if (subject === 'all' || item.dataset.subject === subject) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function downloadPYQ(paperId) {
    alert(`Downloading ${paperId}...\n\nIn a real application, this would:\n- Download the PDF file\n- Track download statistics\n- Update user progress\n- Send notification to teacher`);
}

function previewPYQ(paperId) {
    alert(`Previewing ${paperId}...\n\nIn a real application, this would:\n- Open PDF in browser\n- Show first few pages\n- Allow zoom and navigation\n- Track preview time`);
}

function filterLeaderboard(subject) {
    alert(`Filtering leaderboard by ${subject}...\n\nIn a real application, this would:\n- Update rankings based on subject\n- Show subject-specific scores\n- Highlight top performers\n- Update statistics`);
}

function showFeeHistory() {
    alert('Fee History would show:\n- Payment timeline\n- Transaction details\n- Receipt downloads\n- Payment methods used\n- Refund history');
}

function payFees() {
    alert('Payment Gateway would open with:\n- Payment amount breakdown\n- Multiple payment options\n- Secure payment processing\n- Instant receipt generation\n- SMS/Email confirmation');
}

function downloadReceipt() {
    alert('Downloading receipt...\n\nIn a real application, this would:\n- Generate PDF receipt\n- Include payment details\n- Add digital signature\n- Send to email');
}

function exportTimetable() {
    alert('Exporting timetable...\n\nIn a real application, this would:\n- Generate PDF/Excel file\n- Include all days and subjects\n- Add teacher contact info\n- Sync with calendar apps');
}

function showTimetableDay(day) {
    // Hide all days
    document.querySelectorAll('.timetable-day').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.timetable-nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected day
    document.getElementById(day).classList.add('active');
    event.target.classList.add('active');
    
    // In a real application, this would load the specific day's schedule
    console.log(`Loading timetable for ${day}`);
}

// Teacher Dashboard Detailed Functions
function showLectureDetails(lectureId) {
    alert(`Lecture details for ${lectureId}:\n- Student attendance\n- Lecture materials\n- Assignment details\n- Student questions\n- Performance metrics`);
}

function startLecture(lectureId) {
    alert(`Starting lecture ${lectureId}...\n\nIn a real application, this would:\n- Mark lecture as active\n- Start attendance tracking\n- Enable live streaming\n- Record session`);
}

function addMarks() {
    alert('Add Marks interface would open with:\n- Student selection\n- Subject and test details\n- Grade input forms\n- Bulk upload option\n- Validation checks');
}

function viewReports() {
    alert('Reports would include:\n- Class performance analysis\n- Individual student progress\n- Subject-wise statistics\n- Attendance reports\n- Export options');
}

function takeAttendance() {
    alert('Attendance taking interface would show:\n- Student list with photos\n- Present/Absent/Late options\n- Bulk selection tools\n- Notes section\n- Save and submit');
}

function viewAttendanceReports() {
    alert('Attendance reports would display:\n- Class attendance summary\n- Individual student records\n- Attendance trends\n- Absence patterns\n- Export options');
}

function showTestDetails(testId) {
    alert(`Test details for ${testId}:\n- Question analysis\n- Student performance\n- Time taken per question\n- Common mistakes\n- Improvement suggestions`);
}

function showStudentProgress(studentId) {
    alert(`Student progress for ${studentId}:\n- Performance trends\n- Subject-wise analysis\n- Attendance correlation\n- Improvement areas\n- Recommendations`);
}

function showEventDetails(eventId) {
    alert(`Event details for ${eventId}:\n- Event description\n- Attendee list\n- Resources needed\n- Timeline\n- Follow-up actions`);
}

// Enhanced AI Chatbot Responses
function generateDetailedAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('attendance')) {
        return `Your detailed attendance information:\n\n📊 Overall: 85% (34/40 days)\n📚 Subject-wise:\n• Mathematics: 90%\n• Physics: 85%\n• Chemistry: 80%\n• English: 95%\n\n⚠️ You need to maintain 75% minimum for exam eligibility. You're doing well!\n\nWould you like to see your attendance calendar or get tips to improve?`;
    } else if (lowerMessage.includes('grades') || lowerMessage.includes('marks')) {
        return `Your academic performance:\n\n🏆 Current Rank: 3rd out of 150 students\n📈 Recent Test Scores:\n• Mathematics: 85%\n• Physics: 90%\n• Chemistry: 89%\n• English: 92%\n\n📊 Class Average: 78%\n🎯 Your Average: 88%\n\nYou're performing above average! Keep up the great work. Need help with any specific subject?`;
    } else if (lowerMessage.includes('fees')) {
        return `Your fee status:\n\n💰 Total Due: $2,500\n✅ Paid: $1,800\n⏳ Remaining: $700\n\n📋 Breakdown:\n• Tuition Fee: $1,200 ✅ Paid\n• Library Fee: $200 ✅ Paid\n• Exam Fee: $300 ⏳ Due Dec 20\n• Transport Fee: $400 ✅ Paid\n• Lab Fee: $400 ⚠️ Overdue\n\nWould you like to pay online or need a payment plan?`;
    } else if (lowerMessage.includes('timetable') || lowerMessage.includes('schedule')) {
        return `Your current schedule:\n\n📅 Today (Monday):\n• 9:00 AM - Mathematics (Room 201)\n• 10:30 AM - Physics (Room 205)\n• 12:00 PM - Chemistry (Lab 301)\n• 2:00 PM - English (Room 101)\n\n📚 Tomorrow (Tuesday):\n• 9:00 AM - English\n• 10:30 AM - Biology (Lab 302)\n• 12:00 PM - Computer Science (Lab 401)\n\nNeed to check a specific day or subject?`;
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
        return `I'm here to help! I can assist you with:\n\n📊 Academic:\n• Attendance tracking\n• Grade analysis\n• Study tips\n• Subject help\n\n💰 Administrative:\n• Fee payments\n• Timetable queries\n• Exam schedules\n• School events\n\n💡 Just ask me anything about your studies or school life!`;
    } else {
        return generateAIResponse(message);
    }
}

// Update the sendMessage function to use detailed responses
function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message) {
        addMessage(message, 'user');
        chatbotInput.value = '';
        
        // Simulate AI response with detailed information
        setTimeout(() => {
            const response = generateDetailedAIResponse(message);
            addMessage(response, 'bot');
        }, 1000);
    }
}

// Teacher Dashboard Detailed Functions
function createNewLecture() {
    alert('Create New Lecture would open with:\n- Class selection\n- Subject and topic\n- Date and time\n- Room assignment\n- Materials upload\n- Student list');
}

function viewLectureCalendar() {
    alert('Lecture Calendar would show:\n- Monthly view of all lectures\n- Color-coded by subject\n- Attendance status\n- Quick actions\n- Export options');
}

function showLectureTab(tab) {
    // Hide all tabs
    document.querySelectorAll('.lecture-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.lecture-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    event.target.classList.add('active');
    
    // In a real application, this would load the specific tab content
    console.log(`Loading lecture tab: ${tab}`);
}

function viewLectureDetails(lectureId) {
    alert(`Lecture Details for ${lectureId}:\n- Student attendance list\n- Lecture materials\n- Assignment details\n- Student questions\n- Performance metrics\n- Recording (if available)`);
}

function editLecture(lectureId) {
    alert(`Edit Lecture ${lectureId}:\n- Modify time/date\n- Change room\n- Update topic\n- Add/remove materials\n- Update student list`);
}

function filterMarks(classFilter) {
    alert(`Filtering marks by ${classFilter}...\n\nIn a real application, this would:\n- Update charts and statistics\n- Show class-specific data\n- Filter grade distributions\n- Update student lists`);
}

function exportMarks() {
    alert('Exporting marks...\n\nIn a real application, this would:\n- Generate Excel/PDF report\n- Include all class data\n- Add charts and graphs\n- Send to email');
}

function viewAttendanceCalendar() {
    alert('Attendance Calendar would show:\n- Monthly attendance overview\n- Class-wise breakdown\n- Absence patterns\n- Holiday tracking\n- Export options');
}

function exportAttendance() {
    alert('Exporting attendance...\n\nIn a real application, this would:\n- Generate detailed reports\n- Include charts and analytics\n- Export to Excel/PDF\n- Send to administration');
}

function showAttendanceTab(tab) {
    // Hide all tabs
    document.querySelectorAll('.attendance-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.attendance-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    event.target.classList.add('active');
    
    // In a real application, this would load the specific tab content
    console.log(`Loading attendance tab: ${tab}`);
}

function sendAbsenceNotifications() {
    alert('Sending absence notifications...\n\nIn a real application, this would:\n- Send SMS to parents\n- Email notifications\n- Track delivery status\n- Generate reports');
}

function viewClassAttendance(classId) {
    alert(`Class ${classId} Attendance Details:\n- Individual student records\n- Attendance trends\n- Absence reasons\n- Parent contact info\n- Make-up class options`);
}

function editAttendance(classId) {
    alert(`Edit Attendance for Class ${classId}:\n- Mark students present/absent\n- Add late arrivals\n- Add notes\n- Save changes\n- Notify parents`);
}

// Enhanced Chart Initialization
function initializeDetailedCharts() {
    // Initialize attendance chart for teacher
    const attendanceCtxTeacher = document.getElementById('attendanceChartTeacher');
    if (attendanceCtxTeacher) {
        new Chart(attendanceCtxTeacher, {
            type: 'doughnut',
            data: {
                labels: ['Present', 'Absent', 'Late'],
                datasets: [{
                    data: [85, 10, 5],
                    backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Initialize marks chart
    const marksCtx = document.getElementById('marksChart');
    if (marksCtx) {
        new Chart(marksCtx, {
            type: 'bar',
            data: {
                labels: ['A+', 'A', 'B', 'C', 'D', 'F'],
                datasets: [{
                    label: 'Number of Students',
                    data: [6, 12, 9, 3, 1, 0],
                    backgroundColor: [
                        '#28a745',
                        '#20c997',
                        '#17a2b8',
                        '#ffc107',
                        '#fd7e14',
                        '#dc3545'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Advanced Analytics Functions
function generateDetailedAnalytics() {
    return {
        attendance: {
            overall: 92,
            trends: {
                improving: 15,
                stable: 120,
                declining: 15
            },
            subjects: {
                mathematics: 95,
                physics: 89,
                chemistry: 91,
                english: 94
            }
        },
        performance: {
            average: 78,
            distribution: {
                'A+': 6,
                'A': 12,
                'B': 9,
                'C': 3,
                'D': 1,
                'F': 0
            },
            trends: {
                improving: 8,
                stable: 20,
                declining: 2
            }
        },
        engagement: {
            participation: 85,
            assignments: 92,
            tests: 88,
            projects: 90
        }
    };
}

// Real-time Updates Simulation
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Update attendance percentages
        const attendanceElements = document.querySelectorAll('.attendance-percentage .percentage');
        attendanceElements.forEach(element => {
            const currentValue = parseInt(element.textContent);
            const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            const newValue = Math.max(0, Math.min(100, currentValue + variation));
            element.textContent = newValue + '%';
        });

        // Update progress bars
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const currentWidth = parseInt(bar.style.width);
            const variation = Math.floor(Math.random() * 2) - 1; // -1, 0, or 1
            const newWidth = Math.max(0, Math.min(100, currentWidth + variation));
            bar.style.width = newWidth + '%';
        });
    }, 30000); // Update every 30 seconds
}

// Enhanced Search and Filter Functions
function implementAdvancedSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search students, classes, subjects...';
    searchInput.className = 'search-input';
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        // Implement search functionality
        console.log('Searching for:', searchTerm);
    });
    
    return searchInput;
}

// Data Export Functions
function exportAllData() {
    const data = {
        attendance: generateDetailedAnalytics().attendance,
        performance: generateDetailedAnalytics().performance,
        engagement: generateDetailedAnalytics().engagement,
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'campus-connect-data.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

// Initialize all detailed features
function initializeDetailedFeatures() {
    initializeDetailedCharts();
    simulateRealTimeUpdates();
    
    // Add search functionality
    const searchInput = implementAdvancedSearch();
    document.querySelector('.dashboard-header').appendChild(searchInput);
    
    console.log('Detailed features initialized');
}

// Update the main initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    initializeCharts();
    initializeDetailedFeatures();
});

// Quiz System Functions
let currentQuiz = null;
let currentQuestionIndex = 0;
let quizAnswers = {};
let quizTimer = null;
let quizStartTime = null;

// Sample quiz data
const quizData = {
    math2023: {
        title: "Mathematics 2023 - Set 1",
        duration: 180, // 3 hours in minutes
        questions: [
            {
                id: 1,
                question: "What is the derivative of x² + 3x + 2?",
                options: ["2x + 3", "2x + 2", "x + 3", "2x + 5"],
                correct: "A",
                marks: 4
            },
            {
                id: 2,
                question: "What is the value of ∫(2x + 1)dx from 0 to 2?",
                options: ["6", "8", "10", "12"],
                correct: "A",
                marks: 4
            },
            {
                id: 3,
                question: "What is the limit of (x² - 4)/(x - 2) as x approaches 2?",
                options: ["0", "2", "4", "undefined"],
                correct: "C",
                marks: 4
            },
            {
                id: 4,
                question: "What is the solution to the equation 2x + 5 = 13?",
                options: ["x = 3", "x = 4", "x = 5", "x = 6"],
                correct: "B",
                marks: 4
            },
            {
                id: 5,
                question: "What is the area of a circle with radius 5?",
                options: ["25π", "50π", "75π", "100π"],
                correct: "A",
                marks: 4
            }
        ]
    },
    physics2023: {
        title: "Physics 2023 - Set 1",
        duration: 180,
        questions: [
            {
                id: 1,
                question: "What is the unit of force in the SI system?",
                options: ["Joule", "Newton", "Watt", "Pascal"],
                correct: "B",
                marks: 4
            },
            {
                id: 2,
                question: "What is the speed of light in vacuum?",
                options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10⁹ m/s", "3 × 10¹⁰ m/s"],
                correct: "A",
                marks: 4
            }
        ]
    }
};

function filterQuiz(subject) {
    const quizCategories = document.querySelectorAll('.quiz-category');
    quizCategories.forEach(category => {
        if (subject === 'all' || category.dataset.subject === subject) {
            category.style.display = 'block';
        } else {
            category.style.display = 'none';
        }
    });
}

function startQuiz(quizId) {
    currentQuiz = quizData[quizId];
    if (!currentQuiz) {
        alert('Quiz not found!');
        return;
    }
    
    currentQuestionIndex = 0;
    quizAnswers = {};
    quizStartTime = new Date();
    
    // Show quiz modal
    document.getElementById('quizModal').classList.remove('hidden');
    document.getElementById('quizTitle').textContent = currentQuiz.title;
    document.getElementById('totalQuestions').textContent = currentQuiz.questions.length;
    
    // Start timer
    startQuizTimer();
    
    // Load first question
    loadQuestion(0);
}

function loadQuestion(index) {
    if (index < 0 || index >= currentQuiz.questions.length) return;
    
    currentQuestionIndex = index;
    const question = currentQuiz.questions[index];
    
    // Update question display
    document.getElementById('currentQuestion').textContent = index + 1;
    document.getElementById('questionText').textContent = question.question;
    document.querySelector('.question-number').textContent = `Question ${index + 1}`;
    document.querySelector('.question-marks').textContent = `[${question.marks} Marks]`;
    
    // Update options
    const optionsContainer = document.getElementById('questionOptions');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, i) => {
        const optionElement = document.createElement('label');
        optionElement.className = 'option';
        optionElement.innerHTML = `
            <input type="radio" name="answer" value="${String.fromCharCode(65 + i)}" ${quizAnswers[index] === String.fromCharCode(65 + i) ? 'checked' : ''}>
            <span class="option-text">${option}</span>
        `;
        optionsContainer.appendChild(optionElement);
    });
    
    // Update navigation
    updateQuizNavigation();
    
    // Update progress
    const progress = ((index + 1) / currentQuiz.questions.length) * 100;
    document.getElementById('quizProgress').style.width = progress + '%';
}

function updateQuizNavigation() {
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = currentQuestionIndex === currentQuiz.questions.length - 1;
    
    // Update question number buttons
    document.querySelectorAll('.question-nav').forEach((btn, i) => {
        btn.classList.remove('active');
        if (i === currentQuestionIndex) {
            btn.classList.add('active');
        }
    });
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        saveCurrentAnswer();
        loadQuestion(currentQuestionIndex + 1);
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        saveCurrentAnswer();
        loadQuestion(currentQuestionIndex - 1);
    }
}

function goToQuestion(index) {
    if (index >= 0 && index < currentQuiz.questions.length) {
        saveCurrentAnswer();
        loadQuestion(index);
    }
}

function saveCurrentAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        quizAnswers[currentQuestionIndex] = selectedAnswer.value;
    }
}

function markForReview() {
    const questionNav = document.querySelectorAll('.question-nav')[currentQuestionIndex];
    questionNav.style.background = '#ffc107';
    questionNav.style.color = '#333';
    questionNav.innerHTML = '?';
}

function pauseQuiz() {
    if (quizTimer) {
        clearInterval(quizTimer);
        quizTimer = null;
        alert('Quiz paused. Click "Resume" to continue.');
    } else {
        startQuizTimer();
        alert('Quiz resumed.');
    }
}

function submitQuiz() {
    if (confirm('Are you sure you want to submit the quiz? You cannot change answers after submission.')) {
        saveCurrentAnswer();
        clearInterval(quizTimer);
        showQuizResults();
    }
}

function startQuizTimer() {
    const timerElement = document.getElementById('quizTimer');
    let timeLeft = currentQuiz.duration * 60; // Convert to seconds
    
    quizTimer = setInterval(() => {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        
        timerElement.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(quizTimer);
            alert('Time\'s up! Quiz will be submitted automatically.');
            submitQuiz();
        }
        
        timeLeft--;
    }, 1000);
}

function showQuizResults() {
    // Close quiz modal
    document.getElementById('quizModal').classList.add('hidden');
    
    // Calculate results
    let correctAnswers = 0;
    let totalMarks = 0;
    let obtainedMarks = 0;
    
    currentQuiz.questions.forEach((question, index) => {
        totalMarks += question.marks;
        if (quizAnswers[index] === question.correct) {
            correctAnswers++;
            obtainedMarks += question.marks;
        }
    });
    
    const percentage = Math.round((obtainedMarks / totalMarks) * 100);
    const timeTaken = new Date() - quizStartTime;
    const hours = Math.floor(timeTaken / (1000 * 60 * 60));
    const minutes = Math.floor((timeTaken % (1000 * 60 * 60)) / (1000 * 60));
    
    // Update results modal
    document.getElementById('finalScore').textContent = percentage + '%';
    document.getElementById('correctAnswers').textContent = `${correctAnswers}/${currentQuiz.questions.length}`;
    document.getElementById('timeTaken').textContent = `${hours}h ${minutes}m`;
    document.getElementById('quizRank').textContent = `${Math.floor(Math.random() * 10) + 1}rd out of 150`;
    document.getElementById('improvement').textContent = `+${Math.floor(Math.random() * 10) + 1}% from last attempt`;
    
    // Show results modal
    document.getElementById('quizResultsModal').classList.remove('hidden');
}

function reviewAnswers() {
    alert('Review Answers would show:\n- All questions with correct answers\n- Your selected answers\n- Explanation for each question\n- Performance analysis');
}

function retakeQuiz() {
    if (confirm('Are you sure you want to retake this quiz?')) {
        document.getElementById('quizResultsModal').classList.add('hidden');
        startQuiz(Object.keys(quizData).find(key => quizData[key] === currentQuiz));
    }
}

function shareResults() {
    alert('Share Results would:\n- Generate shareable link\n- Create social media post\n- Send results via email\n- Export as image');
}

// Close quiz modals
document.getElementById('quizClose').addEventListener('click', function() {
    if (confirm('Are you sure you want to exit the quiz? Your progress will be lost.')) {
        document.getElementById('quizModal').classList.add('hidden');
        if (quizTimer) {
            clearInterval(quizTimer);
            quizTimer = null;
        }
    }
});

document.getElementById('resultsClose').addEventListener('click', function() {
    document.getElementById('quizResultsModal').classList.add('hidden');
});

// Export functions for potential module use
window.CampusConnect = {
    showSection,
    toggleChatbot,
    addMessage,
    generateAIResponse,
    generateDetailedAIResponse,
    formatDate,
    formatTime,
    showAttendanceDetails,
    filterPYQ,
    downloadPYQ,
    previewPYQ,
    filterLeaderboard,
    showFeeHistory,
    payFees,
    downloadReceipt,
    exportTimetable,
    showTimetableDay,
    createNewLecture,
    viewLectureCalendar,
    showLectureTab,
    viewLectureDetails,
    editLecture,
    filterMarks,
    exportMarks,
    viewAttendanceCalendar,
    exportAttendance,
    showAttendanceTab,
    sendAbsenceNotifications,
    viewClassAttendance,
    editAttendance,
    generateDetailedAnalytics,
    exportAllData
};
