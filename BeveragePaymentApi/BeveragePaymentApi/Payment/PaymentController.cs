using Asp.Versioning;
using BeveragePaymentApi.Domain;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace BeveragePaymentApi.Payment;

[Route("v{version:apiVersion}/[controller]")]
[ApiController]
[ApiVersion("1.0")]
public class PaymentController : Controller
{

    public PaymentController()
    {
        StripeConfiguration.ApiKey = "sk_test_51PDTdFKZetYTOPv970qtAixsE1HQx463t9ti2ztmzEMtCm42tokDLTQR9ifQNmhBBF9Y3uoKpSfwvei7EBp7iprC00IQubXOaG";
    }

    [HttpPost]
    [Route("create-intent")]
    public ActionResult CreateIntent()
    {
        var options = new PaymentIntentCreateOptions
        {
            Amount = 1099,
            Currency = "usd",
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
            {
                Enabled = true,
            },
        };
        var service = new PaymentIntentService();
        PaymentIntent intent = service.Create(options);
        return Json(new { client_secret = intent.ClientSecret });
    }
}