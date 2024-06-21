namespace MarketplaceAPI.Models;

public class User
{
    public required string Id { get; set; }

    public string? Name { get; set; }

    public Decimal Balance { get; set; }

    public DateTime RegisteredDateTime { get; set; }

    public DateTime LastLogonDateTime { get; set; }
    
    public ICollection<ProductInventory> ProductInventory { get; } = new List<ProductInventory>();
}