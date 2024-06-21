namespace MarketplaceAPI.Models;
public class ErrorModel(int errorCode, string? message, string? details = null)
{
    public int ErrorCode { get; set; } = errorCode;
    public string? Message { get; set; } = message;
    public string? Details { get; set; } = details;
}