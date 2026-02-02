using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagement.API.Data;
using StudentManagement.API.Models;

namespace StudentManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResultController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ResultController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExamResult>>> GetResults(Guid? examId, string? classId)
        {
            var query = _context.Results.AsQueryable();
            if (examId.HasValue) query = query.Where(r => r.ExamId == examId.Value);
            if (!string.IsNullOrEmpty(classId)) query = query.Where(r => r.ClassId == classId);
            return await query.ToListAsync();
        }

        [HttpPost("upsert")]
        public async Task<IActionResult> UpsertResults(List<ExamResult> results)
        {
            foreach (var result in results)
            {
                var existing = await _context.Results.FirstOrDefaultAsync(r => 
                    r.StudentId == result.StudentId && r.ExamId == result.ExamId);

                if (existing != null)
                {
                    if (existing.IsLocked) continue;
                    
                    existing.MarksJson = result.MarksJson;
                    existing.TotalMarks = result.TotalMarks;
                    existing.MaxTotalMarks = result.MaxTotalMarks;
                    existing.Percentage = result.Percentage;
                    existing.FinalGrade = result.FinalGrade;
                    existing.Status = result.Status;
                    existing.IsLocked = result.IsLocked;
                    _context.Entry(existing).State = EntityState.Modified;
                }
                else
                {
                    if (result.Id == Guid.Empty) result.Id = Guid.NewGuid();
                    _context.Results.Add(result);
                }
            }
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
