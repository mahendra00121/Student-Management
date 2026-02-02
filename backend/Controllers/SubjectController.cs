using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagement.API.Data;
using StudentManagement.API.Models;

namespace StudentManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SubjectController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Subject>>> GetSubjects()
        {
            return await _context.Subjects.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Subject>> GetSubject(Guid id)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null) return NotFound();
            return subject;
        }

        [HttpPost]
        public async Task<ActionResult<Subject>> PostSubject(Subject subject)
        {
            try
            {
                if (subject.Id == Guid.Empty) subject.Id = Guid.NewGuid();
                _context.Subjects.Add(subject);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetSubject), new { id = subject.Id }, subject);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubject(Guid id, Subject subject)
        {
            if (id != subject.Id) return BadRequest();
            _context.Entry(subject).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.InnerException?.Message ?? ex.Message);
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubject(Guid id)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null) return NotFound();
            _context.Subjects.Remove(subject);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
