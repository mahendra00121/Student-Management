using System;
using System.ComponentModel.DataAnnotations;

namespace StudentManagement.API.Models
{
    public class FeeRecord
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        public Guid StudentId { get; set; }
        
        public string? StudentName { get; set; }
        public string? RollNumber { get; set; }
        public string? ClassId { get; set; }
        
        [Required]
        public double TotalAmount { get; set; }
        
        [Required]
        public double PaidAmount { get; set; }
        
        public double RemainingAmount => TotalAmount - PaidAmount;
        
        public string Status { get; set; } = "Pending"; // Paid, Partial, Pending
        
        // JSON string for payment history
        public string? PaymentHistoryJson { get; set; }
        
        public DateTime LastPaymentDate { get; set; }
    }
}
