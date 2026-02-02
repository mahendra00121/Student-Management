using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StudentManagement.API.Models
{
    public class Exam
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string Type { get; set; } = string.Empty; // Mid, Final, Unit
        
        [Required]
        [StringLength(50)]
        public string ClassId { get; set; } = string.Empty;
        
        public string StartDate { get; set; } = string.Empty;
        public string EndDate { get; set; } = string.Empty;
        
        public string Status { get; set; } = "Upcoming"; // Upcoming, Ongoing, Completed
        
        // Comma separated JSON or separate table? Let's use a separate table for subjects later
        // For now, save subjects structure as JSON string for simplicity
        public string? SubjectsJson { get; set; }
    }

    public class ExamResult
    {
        [Key]
        public Guid Id { get; set; }
        
        public Guid StudentId { get; set; }
        public string? StudentName { get; set; }
        public string? RollNumber { get; set; }
        public Guid ExamId { get; set; }
        public string? ExamName { get; set; }
        public string? ClassId { get; set; }
        public string? Section { get; set; }
        
        // Store marks as JSON string
        public string? MarksJson { get; set; }
        
        public double TotalMarks { get; set; }
        public double MaxTotalMarks { get; set; }
        public double Percentage { get; set; }
        public string? FinalGrade { get; set; }
        public string? Status { get; set; } // Pass, Fail
        public bool IsLocked { get; set; }
    }
}
