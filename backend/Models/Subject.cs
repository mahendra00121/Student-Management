using System;
using System.ComponentModel.DataAnnotations;

namespace StudentManagement.API.Models
{
    public class Subject
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string ClassName { get; set; } = string.Empty;
        
        public Guid? TeacherId { get; set; }
        
        [StringLength(100)]
        public string? TeacherName { get; set; }
        
        public string Status { get; set; } = "Active";
    }
}
