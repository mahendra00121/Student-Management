using System;
using System.ComponentModel.DataAnnotations;

namespace StudentManagement.API.Models
{
    public class AttendanceRecord
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        public Guid StudentId { get; set; }
        
        [StringLength(100)]
        public string? StudentName { get; set; }
        
        [Required]
        [StringLength(50)]
        public string ClassId { get; set; } = string.Empty;
        
        [Required]
        [StringLength(10)]
        public string Section { get; set; } = string.Empty;
        
        [Required]
        public string Date { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Present"; // Present, Absent, Late
        
        [StringLength(100)]
        public string? MarkedBy { get; set; }
    }
}
