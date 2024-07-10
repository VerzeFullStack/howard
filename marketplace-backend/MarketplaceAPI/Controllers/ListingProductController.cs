using Asp.Versioning;
using MarketplaceAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MarketplaceAPI.Controllers;

[ApiController]
[Route( "api/v{version:apiVersion}/[controller]" )]
public class ListingProductController(ILogger<ListingProductController> logger, MarketplaceContext context) : ControllerBase
{
    private readonly ILogger<ListingProductController> _logger = logger;
    private readonly MarketplaceContext _context = context;
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ListingProduct>>> GetListingProducts(int limit = 0, int offset = 0, string? name = null, string? seller = null)
    {
         var t = _context.ListingProducts.Include(p => p.Seller).AsQueryable();
        if (name != null)
        {
            t = t.Where(p => p.Name == name);
        }

        if (seller != null)
        {
            t = t.Where(p => p.Seller.DisplayName == seller);
        }

        t = t.OrderBy(p => p.Id).Skip(offset);
        if(limit != 0)
        {
            t = t.Take(limit);
        }
        return await t.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<ListingProduct>> ListProduct(ListingProduct listingProduct, int userInventoryProductId)
    {
        var userId = HttpContext.User.Identity?.Name;
        ProductInventory product = await _context.ProductInventories.FirstAsync(p => p.Id == userInventoryProductId);
        if (product.UserId != userId)
        {
            throw new UnauthorizedAccessException();
        }

        _context.ProductInventories.Remove(product);
        _context.ListingProducts.Add(listingProduct);
        await _context.SaveChangesAsync();
        return CreatedAtAction(
            nameof(ListProduct),
            new {id = listingProduct.Id},
            listingProduct);
    }

}