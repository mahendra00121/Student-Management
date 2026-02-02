using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagement.API.Data;
using StudentManagement.API.Models;

namespace StudentManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClassController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClassItem>>> GetClasses()
        {
            return await _context.Classes.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClassItem>> GetClass(Guid id)
        {
            var classItem = await _context.Classes.FindAsync(id);
            if (classItem == null) return NotFound();
            return classItem;
        }

        [HttpPost]
        public async Task<ActionResult<ClassItem>> PostClass(ClassItem classItem)
        {
            try
            {
                if (classItem.Id == Guid.Empty) classItem.Id = Guid.NewGuid();
                _context.Classes.Add(classItem);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetClass), new { id = classItem.Id }, classItem);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutClass(Guid id, ClassItem classItem)
        {
            if (id != classItem.Id) return BadRequest();
            _context.Entry(classItem).State = EntityState.Modified;
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
        public async Task<IActionResult> DeleteClass(Guid id)
        {
            var classItem = await _context.Classes.FindAsync(id);
            if (classItem == null) return NotFound();
            _context.Classes.Remove(classItem);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
