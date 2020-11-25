import { MagentoBundledProduct, MagentoBundledProductItem, MagentoBundledProductItemOption } from '../models/bundled-product';
import { DaffProductTypeEnum } from '../../../models/product';
import { DaffCompositeProduct } from '../../../models/composite-product';
import { 
	DaffCompositeProductItemOption, 
	DaffCompositeProductItem, 
	DaffCompositeProductItemInputEnum 
} from '../../../models/composite-product-item';
import { transformMagentoSimpleProduct } from './simple-product-transformers';
import { MagentoProductStockStatusEnum } from '../models/magento-product';
import { getDiscount, getDiscountedPrice, getPrice } from '../helpers/null-checkers';

/**
 * Transforms the magento MagentoProduct from the magento product query into a DaffProduct. 
 * @param response the response from a magento product query.
 */
export function transformMagentoBundledProduct(product: MagentoBundledProduct, mediaUrl: string): DaffCompositeProduct {
	return {
		...transformMagentoSimpleProduct(product, mediaUrl),
		price: {
			originalPrice: 0,
			discount: {
				percent: 0,
				amount: 0
			},
			discountedPrice: 0
		},
		type: DaffProductTypeEnum.Composite,
		items: product.items.map(transformMagentoBundledProductItem)
	}
}

function transformMagentoBundledProductItem(item: MagentoBundledProductItem): DaffCompositeProductItem {
	return {
		id: item.option_id.toString(),
		required: item.required,
		title: item.title,
		input_type: <DaffCompositeProductItemInputEnum>item.type,
		options: item.options.map(transformMagentoBundledProductItemOption)
	}
}

function transformMagentoBundledProductItemOption(option: MagentoBundledProductItemOption): DaffCompositeProductItemOption {
	return {
		id: option.id.toString(),
		name: option.label,
		images: [],
		price: {
			originalPrice: getPrice(option.product),
			discount: getDiscount(option.product),
			discountedPrice: getDiscountedPrice(option.product)
		},
		quantity: option.quantity,
		is_default: option.is_default,
		in_stock: option.product.stock_status === MagentoProductStockStatusEnum.InStock
	}
}

