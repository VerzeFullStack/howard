using Microsoft.EntityFrameworkCore;

namespace MarketplaceAPI.Models;

public class MarketplaceContext : DbContext
{
    public DbSet<ListingProduct> ListingProducts { get; set; }
    public DbSet<ProductInventory> ProductInventories { get; set; }
    public DbSet<User> Users { get; set; }  
    public string? DbPath { get; }
    public MarketplaceContext(DbContextOptions<MarketplaceContext> options) : base(options)
    {
        var folder = Environment.SpecialFolder.LocalApplicationData;
        var path = Environment.GetFolderPath(folder);
        DbPath = System.IO.Path.Join(path, "marketplace.db");
    }
    // The following configures EF to create a Sqlite database file in the
    // special "local" folder for your platform.
    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasMany(e => e.ProductInventory)
            .WithOne()
            .HasForeignKey(e => e.UserId)
            .IsRequired();

        modelBuilder.Entity<ListingProduct>()
            .HasOne(e => e.Seller)
            .WithMany()
            .HasForeignKey(e => e.SellerId)
            .IsRequired();
    }
}
