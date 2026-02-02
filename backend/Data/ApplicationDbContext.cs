using Microsoft.EntityFrameworkCore;
using StudentManagement.API.Models;

namespace StudentManagement.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<ClassItem> Classes { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<AttendanceRecord> Attendance { get; set; }
        public DbSet<Exam> Exams { get; set; }
        public DbSet<ExamResult> Results { get; set; }
        public DbSet<FeeRecord> Fees { get; set; }
        public DbSet<FeeStructure> FeeStructures { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Any specific configuration for entities
            modelBuilder.Entity<Student>()
                .HasIndex(s => s.RollNumber)
                .IsUnique();
        }
    }
}
