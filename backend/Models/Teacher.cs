using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StudentManagement.API.Models
{
    public class Teacher
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string EmployeeId { get; set; } = string.Empty;
        
        [EmailAddress]
        public string? Email { get; set; }
        
        [StringLength(15)]
        public string? Phone { get; set; }
        
        public string? Status { get; set; } = "Active";
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Note: For simplicity, we'll handle subjects and classes as comma-separated strings or join tables later
        public string? Subjects { get; set; } 
        public string? Classes { get; set; }
    }
}
