using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagement.API.Data;
using StudentManagement.API.Models;

namespace StudentManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FeeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FeeRecord>>> GetFees()
        {
            return await _context.Fees.ToListAsync();
        }

        [HttpGet("{studentId}")]
        public async Task<ActionResult<FeeRecord>> GetStudentFee(Guid studentId)
        {
            var record = await _context.Fees.FirstOrDefaultAsync(f => f.StudentId == studentId);
            if (record == null) return NotFound();
            return record;
        }

        [HttpPost("payment")]
        public async Task<IActionResult> RecordPayment(FeeRecord record)
        {
            var existing = await _context.Fees.FirstOrDefaultAsync(f => f.StudentId == record.StudentId);
            if (existing != null)
            {
                existing.PaidAmount = record.PaidAmount;
                existing.Status = record.Status;
                existing.PaymentHistoryJson = record.PaymentHistoryJson;
                existing.LastPaymentDate = DateTime.UtcNow;
                _context.Entry(existing).State = EntityState.Modified;
            }
            else
            {
                if (record.Id == Guid.Empty) record.Id = Guid.NewGuid();
                record.LastPaymentDate = DateTime.UtcNow;
                _context.Fees.Add(record);
            }
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
