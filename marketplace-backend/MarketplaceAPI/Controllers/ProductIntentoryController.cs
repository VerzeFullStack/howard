using Asp.Versioning;
using MarketplaceAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace MarketplaceAPI.Controllers;

[ApiController]
[Route( "api/v{version:apiVersion}/[controller]" )]
public class ProductInventoryController(ILogger<ProductInventory> logger, MarketplaceContext context) : ControllerBase
{
        private readonly ILogger<ProductInventory> _logger = logger;
        private readonly MarketplaceContext _context = context;

    [HttpPost]
    public async Task<ActionResult<User>> PostProductInventory(ProductInventory productInventory)
    {
        _context.ProductInventories.Add(productInventory);
        await _context.SaveChangesAsync();
            return CreatedAtAction(
                nameof(PostProductInventory),
                new {id = productInventory.Id},
                productInventory);
    }

}
