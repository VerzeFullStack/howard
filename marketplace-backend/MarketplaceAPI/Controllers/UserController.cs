using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MarketplaceAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web.Resource;

namespace MarketplaceAPI.Controllers;

[Authorize]
[ApiController]
[ApiVersion( 1.0 )]
[Route( "api/v{version:apiVersion}/[controller]" )]
public class UserController(ILogger<UserController> logger, MarketplaceContext context) : ControllerBase
{
    private readonly ILogger<UserController> _logger = logger;
    private readonly MarketplaceContext _context = context;

    // GET: api/Users
    [HttpGet, MapToApiVersion( 1.0 )]
    [RequiredScope("users.read")]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.Include(u => u.ProductInventory).ToListAsync();
    }

    // GET: api/Users/5
    // <snippet_GetByID>
    [HttpGet("{id}"), MapToApiVersion( 1.0 )]
    public async Task<ActionResult<User>> GetUsers(string id)
    {
        var userId = HttpContext.User.Identity?.Name;
        if (userId != id)
        {
            throw new UnauthorizedAccessException($"You are not authorized to get user with ID {id}.");
        }

        var existingUser = await _context.Users.Include(u => u.ProductInventory).FirstOrDefaultAsync(u => u.Id == userId) ?? throw new KeyNotFoundException($"User with ID {id} does not exist.");
        return existingUser;
    }

    // PUT: api/Users/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    // <snippet_Update>
    [HttpPut("{id}"), MapToApiVersion( 1.0 )]
    public async Task<IActionResult> PutUsers(string id, User user)
    {
        var userId = HttpContext.User.Identity?.Name;
        if (userId != user.Id)
        {
            throw new UnauthorizedAccessException($"You are not authorized to update user with ID {user.Id}.");
        }

        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == user.Id) ?? throw new KeyNotFoundException($"User with ID {user.Id} does not exist.");

        existingUser.Name = user.Name;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException) when (!UserExists(id))
        {
            return NotFound();
        }

        return Ok(existingUser);
    }

    private bool UserExists(string id)
    {
        throw new NotImplementedException($"User already exist {id}");
    }

    // </snippet_Update>

    // POST: api/Users
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    // <snippet_Create>
    [HttpPost, MapToApiVersion( 1.0 )]
    public async Task<ActionResult<User>> PostUsers()
    {
        var userId = HttpContext.User.Identity?.Name;
        var displayName = HttpContext.User.Claims.First(c => c.Type == "Name").Value;
        if (String.IsNullOrEmpty(userId))
        {
            throw new ArgumentException("Invalid User ID.");
        }

        var newUser = new User()
        {
            Id = userId,
            Name = displayName,
            Balance = 0,
            LastLogonDateTime = DateTime.Now,
            RegisteredDateTime = DateTime.Now
        };
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(PostUsers),
            new { id = newUser.Id },
            newUser);
    }
    // </snippet_Create>

    // DELETE: api/Users/5
    [HttpDelete("{id}"), MapToApiVersion( 1.0 )]
    public async Task<IActionResult> DeleteUsers(string id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }

}
