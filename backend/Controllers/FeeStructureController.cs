using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagement.API.Data;
using StudentManagement.API.Models;

namespace StudentManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeeStructureController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FeeStructureController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FeeStructure>>> GetFeeStructures()
        {
            return await _context.FeeStructures.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<FeeStructure>> PostFeeStructure(FeeStructure structure)
        {
            var existing = await _context.FeeStructures.FirstOrDefaultAsync(f => f.ClassName == structure.ClassName);
            if (existing != null)
            {
                existing.TuitionFee = structure.TuitionFee;
                existing.ExamFee = structure.ExamFee;
                existing.OtherFee = structure.OtherFee;
                _context.Entry(existing).State = EntityState.Modified;
            }
            else
            {
                if (structure.Id == Guid.Empty) structure.Id = Guid.NewGuid();
                _context.FeeStructures.Add(structure);
            }
            
            await _context.SaveChangesAsync();
            return Ok(structure);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeeStructure(Guid id)
        {
            var structure = await _context.FeeStructures.FindAsync(id);
            if (structure == null) return NotFound();
            _context.FeeStructures.Remove(structure);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
