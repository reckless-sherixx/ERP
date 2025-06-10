# 🏢 ERP System - Enterprise Resource Planning

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

> 🚀 A modern, full-stack Enterprise Resource Planning (ERP) system built with Next.js, TypeScript, and cutting-edge web technologies.

---

## 👥 **Member Roles & Functionality**

Our ERP system implements a comprehensive role-based access control (RBAC) system with five distinct user levels, each with specific permissions and capabilities:

### 🔴 **System Admin** - Ultimate System Control
**Access Level**: Full

**Core Responsibilities**:
- 🛡️ **System Configuration**: Manage global settings, security policies, and system parameters
- 👑 **User Management**: Create, modify, and delete all user accounts across all roles
- 🔧 **Module Management**: Enable/disable ERP modules and configure system-wide features
- 💾 **Database Management**: Perform backups, maintenance, and data migration tasks
- 🔐 **Security Oversight**: Manage security settings, audit logs, and compliance reports
- 🏢 **Multi-tenant Management**: Configure and manage multiple organization instances

**Key Capabilities**:
- Configuration of all system settings
- Complete user management across all roles
- System backups and maintenance
- Global security and compliance management

---

### 🟠 **Admin** - Organization Management
**Access Level**: High

**Core Responsibilities**:
- 🏢 **Organization Setup**: Configure company settings, departments, and organizational structure
- 👥 **User Administration**: Manage user accounts within their organization (except System Admin)
- 📋 **All Modules Access**: Full access to all ERP modules and features
- 🔍 **Advanced Reporting**: Generate comprehensive reports across all departments
- 💰 **Financial Oversight**: Access all financial data, budgets, and financial reports
- 📊 **Performance Monitoring**: Track KPIs, productivity metrics, and organizational performance

**Key Capabilities**:
- Access to all modules and features
- Comprehensive reporting and analytics
- User management (excluding System Admin)
- Full organizational oversight

---

### 🟡 **Factory Manager** - Production Leadership
**Access Level**: Medium

**Core Responsibilities**:
- 🏭 **Production Management**: Oversee manufacturing operations and production schedules
- 👥 **Workforce Allocation**: Assign staff to production tasks and manage work shifts
- 📊 **Production Updates**: Monitor and update production status and progress
- 🔧 **Resource Management**: Manage production resources and equipment allocation
- 📈 **Performance Tracking**: Track production KPIs and efficiency metrics

**Key Capabilities**:
- Production updates and monitoring
- Workforce allocation and management
- Manufacturing operations oversight

---

### 🟢 **Inventory Manager** - Stock Management
**Access Level**: Medium

**Core Responsibilities**:
- 📦 **Stock Management**: Monitor inventory levels, track stock movements
- 🛒 **Procurement**: Manage purchase orders and supplier relationships
- 📊 **Usage Tracking**: Track material usage and consumption patterns
- 🔍 **Inventory Analytics**: Generate inventory reports and forecasting
- ⚠️ **Stock Alerts**: Manage low stock alerts and reorder points

**Key Capabilities**:
- Stock management and monitoring
- Procurement and supplier management
- Usage tracking and analytics

---

### 💼 **Sales Team** - Customer Relations
**Access Level**: Medium

**Core Responsibilities**:
- 👥 **Customer Management**: Maintain customer database and relationships
- 📋 **Order Creation**: Process sales orders and manage order lifecycle
- 💰 **Quotations**: Create and manage customer quotations and proposals
- 📈 **Sales Analytics**: Track sales performance and customer metrics
- 🤝 **Client Communication**: Manage customer communications and follow-ups

**Key Capabilities**:
- Customer management and CRM
- Order creation and processing
- Quotation management and sales tracking

---

### 🎨 **Design Team** - Creative Management
**Access Level**: Medium

**Core Responsibilities**:
- 📐 **Design Upload**: Upload and manage design files and specifications
- 📋 **Specification Management**: Maintain product specifications and requirements
- 🔄 **Revision Tracking**: Track design changes and version control
- 🎯 **Project Coordination**: Coordinate with production and sales teams
- 📊 **Design Analytics**: Monitor design approval rates and timelines

**Key Capabilities**:
- Design file upload and management
- Specification management and tracking
- Design revision control and versioning

---

### 💰 **Accounting** - Financial Management
**Access Level**: Medium

**Core Responsibilities**:
- 🧾 **Invoicing**: Create and manage customer invoices and billing
- 💳 **Payment Tracking**: Monitor payments, receivables, and outstanding amounts
- 📊 **Financial Reporting**: Generate financial reports and statements
- 🔍 **Expense Management**: Track business expenses and cost analysis
- 📈 **Financial Analytics**: Provide financial insights and forecasting

**Key Capabilities**:
- Invoicing and billing management
- Payment tracking and monitoring
- Financial reporting and analytics

---

### 🔧 **Production Staff** - Operational Tasks
**Access Level**: Low

**Core Responsibilities**:
- ✅ **Task Updates**: Update status of assigned production tasks
- 📝 **Material Logging**: Log materials used in production processes
- ⏰ **Time Tracking**: Record work hours and task completion times
- 📊 **Progress Reporting**: Report on task progress and completion
- 🔧 **Equipment Usage**: Log equipment usage and maintenance needs

**Key Capabilities**:
- Task status updates and progress tracking
- Material usage logging and recording
- Production data entry and reporting

---

### 👥 **Customers** - External Access
**Access Level**: Restricted

**Core Responsibilities**:
- 👀 **Order Viewing**: View their order history and current order status
- ✅ **Design Approval**: Approve or request changes to design proposals
- 📊 **Production Progress**: Track progress of their orders through production
- 💬 **Communication**: Communicate with sales team regarding orders
- 📋 **Account Management**: Manage their customer profile and preferences

**Key Capabilities**:
- View orders and order history
- Approve designs and specifications
- Track production progress for their orders

---

### 🔐 **Permission Matrix**

| Feature | System Admin | Admin | Factory Manager | Inventory Manager | Sales Team | Design Team | Accounting | Production Staff | Customers |
|---------|--------------|-------|-----------------|-------------------|------------|-------------|------------|------------------|-----------|
| **System Configuration** | ✅ Full Control | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None |
| **User Management** | ✅ All Users | ✅ Organization | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None |
| **Production Management** | ✅ Full Access | ✅ Full Access | ✅ Updates & Allocation | ❌ View Only | ❌ View Only | ❌ View Only | ❌ View Only | ✅ Task Updates | ✅ Progress View |
| **Inventory & Stock** | ✅ Full Access | ✅ Full Access | ❌ View Only | ✅ Full Management | ❌ View Only | ❌ View Only | ❌ View Only | ✅ Log Usage | ❌ None |
| **Sales & CRM** | ✅ Full Access | ✅ Full Access | ❌ View Only | ❌ View Only | ✅ Full Management | ❌ View Only | ❌ View Only | ❌ None | ✅ View Orders |
| **Design Management** | ✅ Full Access | ✅ Full Access | ❌ View Only | ❌ View Only | ❌ View Only | ✅ Full Management | ❌ View Only | ❌ None | ✅ Approve Designs |
| **Financial Data** | ✅ Full Access | ✅ Full Access | ❌ Department | ❌ Department | ❌ Department | ❌ Department | ✅ Full Management | ❌ None | ❌ None |
| **Reporting** | ✅ All Reports | ✅ All Reports | ✅ Production | ✅ Inventory | ✅ Sales | ✅ Design | ✅ Financial | ✅ Task Reports | ✅ Order Status |
| **Data Modification** | ✅ All Data | ✅ All Data | ✅ Production Data | ✅ Inventory Data | ✅ Sales Data | ✅ Design Data | ✅ Financial Data | ✅ Task Data | ✅ Limited |
| **Approval Authority** | ✅ All Levels | ✅ Organization | ✅ Production | ✅ Procurement | ✅ Sales Orders | ✅ Design Changes | ✅ Payments | ❌ None | ✅ Design Approval |

### 🛡️ **Security Features**

- **Multi-Factor Authentication (MFA)**: Available for all roles
- **Session Management**: Automatic timeout and concurrent session control
- **Audit Logging**: Complete activity tracking for compliance
- **Data Encryption**: End-to-end encryption for sensitive information
- **IP Restrictions**: Role-based IP access control
- **Temporary Access**: Time-limited access grants for external users

---

## 🎯 **Project Overview**

This ERP system is designed to streamline business operations by integrating various organizational processes into a single, unified platform. Built with modern web technologies, it provides a scalable, maintainable, and user-friendly solution for managing business resources efficiently.

### ✨ **Key Features**

- 📊 **Dashboard Analytics** - Real-time business insights and KPI tracking
- 👥 **User Management** - Role-based access control and authentication
- 📦 **Inventory Management** - Track stock levels, orders, and suppliers
- 💰 **Financial Management** - Accounting, invoicing, and financial reporting
- 🛒 **Sales & CRM** - Customer relationship management and sales tracking
- 📋 **Project Management** - Task assignment and progress tracking
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🔒 **Security First** - Enterprise-grade security and data protection

---

## 🚀 **Getting Started**

### 📋 **Prerequisites**

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Git** for version control

### ⚡ **Quick Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/reckless-sherixx/ERP.git
   cd ERP
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see your ERP system in action! 🎉

---

## 🛠 **Tech Stack**

Our ERP system is powered by a modern, enterprise-grade technology stack designed for performance, scalability, and developer experience:

| Technology | Purpose | Version | Benefits |
|------------|---------|---------|----------|
| **Next.js** | Full-stack React framework | 15.3.2 | SSR, SSG, API routes, optimal performance |
| **React** | UI component library | 19.0 | Latest features, improved performance |
| **TypeScript** | Type-safe JavaScript | 5.0+ | Enhanced code quality and developer experience |
| **Prisma** | Database ORM | 5.0+ | Type-safe database operations and migrations |
| **PostgreSQL** | Relational database | 16.0+ | Enterprise-grade data storage and reliability |
| **WebSockets** | Real-time communication | Latest | Live updates and collaborative features |
| **Docker** | Containerization | 24.0+ | Consistent deployment and scalability |
| **Tailwind CSS** | Utility-first CSS framework | 3.x | Rapid UI development and consistent styling |
| **NextAuth.js** | Authentication | Latest | Secure, flexible authentication system |

### 🔥 **Advanced Features & Optimizations**

**🚀 Performance Enhancements**
- **React 19 Concurrent Features**: Improved rendering performance and user experience
- **Next.js 15.3.2 Turbopack**: Lightning-fast development builds and hot reloading
- **Streaming SSR**: Progressive page loading for better perceived performance
- **Automatic Code Splitting**: Optimized bundle sizes for faster loading

**🔄 Real-time Capabilities**
- **WebSocket Integration**: Instant data synchronization across all connected clients
- **Live Collaboration**: Real-time editing and updates without page refreshes
- **Push Notifications**: Immediate alerts for critical business events
- **Live Analytics**: Real-time dashboard updates and metrics

**🗄️ Database Excellence**
- **Prisma ORM**: Type-safe database operations with excellent developer experience
- **PostgreSQL**: ACID compliance, complex queries, and enterprise reliability
- **Migration System**: Version-controlled database schema evolution
- **Connection Pooling**: Optimized database connections for high performance

**🐳 Deployment & DevOps**
- **Docker Multi-stage Builds**: Optimized container images for production
- **Environment Isolation**: Consistent behavior across development, staging, and production
- **Horizontal Scaling**: Container orchestration ready for enterprise deployment
- **Health Checks**: Built-in monitoring and auto-recovery capabilities

---

### 🗂 **Key Files Description**

- **`src/app/page.tsx`** - Main application entry point
- **`src/app/layout.tsx`** - Global layout and providers
- **`next.config.ts`** - Next.js build and runtime configuration
- **`prisma/schema.prisma`** - Database schema definition

---

## 🎨 **Features & Functionality**

### 📊 **Core ERP Modules**

- [x] **User Authentication & Authorization**
  - Secure login/logout functionality
  - Multi-tier role-based access control system
  - Session management with NextAuth.js
  - Granular permission management

- [x] **Dashboard & Analytics**
  - Real-time business metrics
  - Interactive charts and graphs
  - Customizable widget layouts

- [x] **Inventory Management**
  - Product catalog management
  - Stock level tracking
  - Supplier relationship management
  - Purchase order processing

- [x] **Financial Management**
  - Invoice generation and tracking
  - Expense management
  - Financial reporting and analytics
  - Budget planning tools

- [x] **Customer Relationship Management (CRM)**
  - Customer database management
  - Sales pipeline tracking
  - Communication history
  - Lead generation and conversion

- [ ] **Human Resources (Coming Soon)**
  - Employee management
  - Payroll processing
  - Performance tracking
  - Leave management

- [ ] **Project Management (Coming Soon)**
  - Task assignment and tracking
  - Timeline management
  - Resource allocation
  - Progress reporting

### 🖼 **Screenshots**

> 📸 *Screenshots will be added as features are developed*

---

## 🔧 **Configuration & Customization**

### ⚙️ **Environment Variables**

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="your_database_connection_string"

# Authentication
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

# API Keys
NEXT_PUBLIC_API_URL="your_api_endpoint"

# Email Service (optional)
EMAIL_SERVER_HOST="your_smtp_host"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your_email_user"
EMAIL_SERVER_PASSWORD="your_email_password"
```

### 🎨 **Customization Options**

- **Theming**: Modify `tailwind.config.ts` for custom colors and styling
- **Database**: Configure your preferred database in `prisma/schema.prisma`
- **Authentication**: Customize auth providers in `src/lib/auth.ts`
- **API Routes**: Add custom endpoints in `src/app/api/`

---

## 🏗 **Contributing**

We welcome contributions from the community! Here's how you can help:

### 🤝 **How to Contribute**

1. **Fork the repository**
   ```bash
   git fork https://github.com/reckless-sherixx/ERP.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Create a Pull Request**
   - Provide a clear description of your changes
   - Link any relevant issues
   - Ensure all tests pass

### 📋 **Development Guidelines**

- **Code Style**: Follow TypeScript and React best practices
- **Commits**: Use conventional commit messages
- **Testing**: Write tests for new features
- **Documentation**: Update README and inline comments

### 🌟 **Areas for Contribution**

- 🐛 Bug fixes and performance improvements
- ✨ New ERP modules and features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🔧 DevOps and deployment optimizations



## 🚀 **Deployment**

### 🌐 **Vercel (Recommended)**

The easiest way to deploy your ERP system:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

### 🐳 **Docker**

```bash
# Build the Docker image
docker build -t erp-system .

# Run the container
docker run -p 3000:3000 erp-system
```

### ☁️ **Other Platforms**

- **Netlify**: Follow the [Next.js deployment guide](https://docs.netlify.com/frameworks/next-js/)
- **Railway**: One-click deployment with database included
- **DigitalOcean**: Deploy on App Platform

---

## 📚 **Documentation & Resources**

### 📖 **Learn More**

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [React Documentation](https://react.dev/) - Learn React fundamentals
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Master TypeScript
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Utility-first CSS framework



## 📜 **License & Credits**

### 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### 👥 **Contributors**

<a href="https://github.com/reckless-sherixx/ERP/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=reckless-sherixx/ERP" />
</a>

---

## 🌟 **Support the Project**

If you find this project helpful, please consider:

- ⭐ **Starring** this repository
- 🐛 **Reporting** bugs and issues
- 💡 **Suggesting** new features
- 🤝 **Contributing** code improvements
- 📢 **Sharing** with your network

---

<div align="center">

**Made with ❤️ by [reckless-sherixx](https://github.com/reckless-sherixx)**

*Empowering businesses with modern ERP solutions*

</div>
