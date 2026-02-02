using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagement.API.Data;
using StudentManagement.API.Models;

namespace StudentManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AttendanceController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AttendanceRecord>>> GetAttendance(string? date, string? classId, string? section)
        {
            var query = _context.Attendance.AsQueryable();

            if (!string.IsNullOrEmpty(date)) query = query.Where(a => a.Date == date);
            if (!string.IsNullOrEmpty(classId)) query = query.Where(a => a.ClassId == classId);
            if (!string.IsNullOrEmpty(section)) query = query.Where(a => a.Section == section);

            return await query.ToListAsync();
        }

        [HttpPost("mark")]
        public async Task<IActionResult> MarkAttendance(List<AttendanceRecord> records)
        {
            try
            {
                foreach (var record in records)
                {
                    var existing = await _context.Attendance.FirstOrDefaultAsync(a => 
                        a.StudentId == record.StudentId && a.Date == record.Date);

                    if (existing != null)
                    {
                        existing.Status = record.Status;
                        existing.MarkedBy = record.MarkedBy;
                        _context.Entry(existing).State = EntityState.Modified;
                    }
                    else
                    {
                        if (record.Id == Guid.Empty) record.Id = Guid.NewGuid();
                        _context.Attendance.Add(record);
                    }
                }
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
