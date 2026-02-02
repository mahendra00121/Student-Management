using System;
using System.ComponentModel.DataAnnotations;

namespace StudentManagement.API.Models
{
    public class Student
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string RollNumber { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string ClassName { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string? Section { get; set; }
        
        [StringLength(15)]
        public string? Phone { get; set; }
        
        [EmailAddress]
        public string? Email { get; set; }
        
        public string? Status { get; set; } = "Active";
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
