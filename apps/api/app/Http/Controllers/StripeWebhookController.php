<?php

namespace App\Http\Controllers;

use App\Models\User;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierWebhookController;
use Symfony\Component\HttpFoundation\Response;

/**
 * Extends Cashier's webhook handling to keep our own `users.plan` column
 * (used everywhere else in the app via User::isPremium()) in sync with
 * whatever Cashier's subscription tables say happened on Stripe's side.
 */
class StripeWebhookController extends CashierWebhookController
{
    protected function handleCustomerSubscriptionCreated(array $payload): Response
    {
        $response = parent::handleCustomerSubscriptionCreated($payload);
        $this->syncPlan($payload);

        return $response;
    }

    protected function handleCustomerSubscriptionUpdated(array $payload): ?Response
    {
        $response = parent::handleCustomerSubscriptionUpdated($payload);
        $this->syncPlan($payload);

        return $response;
    }

    protected function handleCustomerSubscriptionDeleted(array $payload): Response
    {
        $response = parent::handleCustomerSubscriptionDeleted($payload);
        $this->syncPlan($payload);

        return $response;
    }

    private function syncPlan(array $payload): void
    {
        /** @var User|null $user */
        $user = $this->getUserByStripeId($payload['data']['object']['customer']);

        if (! $user) {
            return;
        }

        $user->forceFill(['plan' => $user->subscribed('default') ? 'premium' : 'free'])->save();
    }
}
