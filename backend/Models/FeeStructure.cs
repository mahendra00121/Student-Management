using System;
using System.ComponentModel.DataAnnotations;

namespace StudentManagement.API.Models
{
    public class FeeStructure
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string ClassName { get; set; } = string.Empty;
        
        public double TuitionFee { get; set; }
        public double ExamFee { get; set; }
        public double OtherFee { get; set; }
        
        public double TotalFee => TuitionFee + ExamFee + OtherFee;
    }
}
