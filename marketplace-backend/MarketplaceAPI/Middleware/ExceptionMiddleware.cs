using System.Net;

namespace MarketplaceAPI.Middleware;

public class ExceptionMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next;

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch(Exception ex)
        {
            context.Response.ContentType = "text/plain";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            if (ex is ApplicationException)
            {
                await context.Response.WriteAsync(ex.Message);
            }
        }
    }
}