using System;
using System.ComponentModel.DataAnnotations;

namespace StudentManagement.API.Models
{
    public class ClassItem
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;
        
        // Comma separated sections like "A,B,C"
        public string? Sections { get; set; }
        
        public Guid? ClassTeacherId { get; set; }
        
        [StringLength(100)]
        public string? ClassTeacherName { get; set; }
    }
}
