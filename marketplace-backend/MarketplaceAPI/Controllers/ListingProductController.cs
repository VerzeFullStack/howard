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
    
    [HttpGet, MapToApiVersion( 1.0 )]
    public async Task<ActionResult<IEnumerable<ListingProduct>>> GetListingProducts(int limit = 0, int offset = 0, string? name = null, string? seller = null)
    {
         var t = _context.ListingProducts.Include(p => p.Seller).AsQueryable();
        if (name != null)
        {
            t = t.Where(p => p.Name == name);
        }

        if (seller != null)
        {
            t = t.Where(p => p.Seller.Name == seller);
        }

        return await t.OrderBy(p => p.Id).Skip(offset).Take(limit).ToListAsync();
    }

    [HttpPost, MapToApiVersion( 1.0 )]
    public async Task<ActionResult<ListingProduct>> PostListingProduct(ListingProduct listingProduct)
    {
    _context.ListingProducts.Add(listingProduct);
    await _context.SaveChangesAsync();
    return CreatedAtAction(
        nameof(PostListingProduct),
        new {id = listingProduct.Id},
        listingProduct);
    }

}