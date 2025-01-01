import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { ProductService } from '@medusajs/medusa';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productService: ProductService = req.scope.resolve('productService');
  const productId = req.params.id;
  
  try {
    const product = await productService.retrieve(productId, {
      select: ['id', 'title', 'description', 'handle'],
      relations: ['variants', 'variants.prices']
    });
    
    return res.json({
      product: {
        id: product.id,
        title: product.title,
        description: product.description,
        handle: product.handle,
        variants: product.variants.map(variant => ({
          id: variant.id,
          title: variant.title,
          prices: variant.prices.map(price => ({
            amount: price.amount,
            currency_code: price.currency_code
          }))
        }))
      }
    });
  } catch (error) {
    return res.status(404).json({
      message: 'Product not found'
    });
  }
}