using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagement.API.Data;
using StudentManagement.API.Models;

namespace StudentManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ExamController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Exam>>> GetExams()
        {
            return await _context.Exams.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Exam>> GetExam(Guid id)
        {
            var exam = await _context.Exams.FindAsync(id);
            if (exam == null) return NotFound();
            return exam;
        }

        [HttpPost]
        public async Task<ActionResult<Exam>> PostExam(Exam exam)
        {
            if (exam.Id == Guid.Empty) exam.Id = Guid.NewGuid();
            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetExam), new { id = exam.Id }, exam);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutExam(Guid id, Exam exam)
        {
            if (id != exam.Id) return BadRequest();
            _context.Entry(exam).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExam(Guid id)
        {
            var exam = await _context.Exams.FindAsync(id);
            if (exam == null) return NotFound();
            _context.Exams.Remove(exam);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
