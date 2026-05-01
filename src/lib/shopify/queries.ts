
export const imageFragment = /* GraphQL */ `
  fragment image on Image {
    url(transform: { preferredContentType: WEBP })
    altText
    width
    height
  }
`;

export const productFragment = /* GraphQL */ `
  fragment product on Product {
  
    id
    handle
    title
    description
    descriptionHtml
    vendor          
    productType     
    tags            
    
   
    availableForSale
    isGiftCard
    requiresSellingPlan   # True if this is a subscription-only product
    createdAt
    publishedAt
    updatedAt
    
  
    seo {
      title
      description
    }
    
   
    collections(first: 10) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
    
    options {
      id
      name
      values
    }
    
  
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    
   
    variants(first: 250) {
      edges {
        node {
          id
          title
          sku                 
          barcode             
          
        
          availableForSale
          currentlyNotInStock   
          quantityAvailable   
          
        
          requiresShipping
          taxable
          weight
          weightUnit
          
          selectedOptions {
            name
            value
          }
          
         
          price {
            amount
            currencyCode
          }
          compareAtPrice {    
            amount
            currencyCode
          }
          
         
          unitPrice {
            amount
            currencyCode
          }
          unitPriceMeasurement {
            measuredType
            quantityUnit
            quantityValue
            referenceUnit
            referenceValue
          }
          
          image {             
            ...image
          }
        }
      }
    }
    
  
    media(first: 20) {
      edges {
        node {
          mediaContentType
          alt
          ... on MediaImage {
            image {
              ...image
            }
          }
          ... on Video {
            sources {
              url
              mimeType
            }
          }
        }
      }
    }
    
    featuredImage {
      ...image
    }
    
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }

  }
  ${imageFragment}
`;


export const getProductsQuery = /* GraphQL */ `
  query getProducts(
    $first: Int!
    $after: String
    $query: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
  ) {
    products(
      first: $first
      after: $after
      query: $query
      sortKey: $sortKey
      reverse: $reverse
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;

export const getCollectionNamesQuery = /* GraphQL */ `
  query getCollectionNames($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          title
          handle
        }
      }
    }
  }
`;


export const searchProductsQuery = /* GraphQL */ `
  query searchProducts($query: String!) {
    products(first: 6, query: $query) {
      edges {
        node {
          id
          title
          handle
          productType
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export const getProductByHandleQuery = /* GraphQL */ `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;

export const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...product
    }
  }
  ${productFragment}
`;


export const cartFragment = /* GraphQL */ `
  fragment cart on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              price {
                amount
                currencyCode
              }
              product {
                id
                handle
                title
                featuredImage {
                  ...image
                }
              }
            }
          }
        }
      }
    }
  }
  ${imageFragment}
`;

export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${cartFragment}
`;

export const createCartMutation = /* GraphQL */ `
  mutation createCart($lineItems: [CartLineInput!]) {
    cartCreate(input: { lines: $lineItems }) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

export const addToCartMutation = /* GraphQL */ `
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

export const removeFromCartMutation = /* GraphQL */ `
  mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

export const updateCartMutation = /* GraphQL */ `
  mutation updateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

export const updateCartBuyerIdentityMutation = /* GraphQL */ `
  mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;


// export const getCollectionProductsQuery = /* GraphQL */ `
//   query getCollectionProducts($handle: String!, $first: Int!) {
//     collection(handle: $handle) {
//       products(first: $first) {
//         edges {
//           node {
//             ...product
//           }
//         }
//       }
//     }
//   }
//   ${productFragment}
// `;


// Add to queries.ts

export const customerFragment = /* GraphQL */ `
  fragment customer on Customer {
    id
    firstName
    lastName
    email
    phone
    acceptsMarketing
    createdAt
  }
`;

export const customerCreateMutation = /* GraphQL */ `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        ...customer
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
  ${customerFragment}
`;

export const customerAccessTokenCreateMutation = /* GraphQL */ `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const customerAccessTokenDeleteMutation = /* GraphQL */ `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
`;

export const getCustomerQuery = /* GraphQL */ `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      ...customer
    }
  }
  ${customerFragment}
`;

export const customerRecoverMutation = /* GraphQL */ `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const getCustomerOrdersQuery = /* GraphQL */ `
  query getCustomerOrders($customerAccessToken: String!, $first: Int = 20) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            email
            statusUrl
            processedAt
            canceledAt 
            financialStatus
            fulfillmentStatus
            subtotalPrice {
              amount
              currencyCode
            }
            totalTax {
              amount
              currencyCode
            }
            totalShippingPrice {
              amount
              currencyCode
            }
            totalPrice {
              amount
              currencyCode
            }
            shippingAddress {
              name
              address1
              address2
              city
              province
              zip
              country
            }
            successfulFulfillments {
              trackingCompany
              trackingInfo {
                number
                url
              }
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// --- UPDATE CUSTOMER PROFILE & PASSWORD ---
export const customerUpdateMutation = /* GraphQL */ `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        firstName
        lastName
        email
        phone
        acceptsMarketing 
        createdAt        
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// src/lib/shopify/queries.ts

export const customerAddressFragment = /* GraphQL */ `
  fragment customerAddress on MailingAddress {
    id
    firstName
    lastName
    company
    address1
    address2
    city
    province
    country
    zip
    phone
  }
`;

export const getCustomerAddressesQuery = /* GraphQL */ `
  query getCustomerAddresses($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      defaultAddress {
        id
      }
      addresses(first: 10) {
        edges {
          node {
            ...customerAddress
          }
        }
      }
    }
  }
  ${customerAddressFragment}
`;

export const customerAddressCreateMutation = /* GraphQL */ `
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        ...customerAddress
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
  ${customerAddressFragment}
`;

export const customerAddressUpdateMutation = /* GraphQL */ `
  mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        ...customerAddress
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
  ${customerAddressFragment}
`;

export const customerAddressDeleteMutation = /* GraphQL */ `
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const customerDefaultAddressUpdateMutation = /* GraphQL */ `
  mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
    customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// Add to the bottom of queries.ts

export const getAboutPageQuery = /* GraphQL */ `
  query getAboutPage($handle: String!) {
    metaobject(handle: {handle: $handle, type: "about_page"}) {
      # Images
      hero_image: field(key: "hero_image") { reference { ... on MediaImage { image { url altText } } } }
      intro_image: field(key: "intro_image") { reference { ... on MediaImage { image { url altText } } } }
      who_we_are_image: field(key: "who_we_are_image") { reference { ... on MediaImage { image { url altText } } } }
      
      # Hero & Intro Text
      hero_title: field(key: "hero_title") { value }
      intro_heading: field(key: "intro_heading") { value }
      intro_paragraph: field(key: "intro_paragraph") { value }
      
      # Who We Are Text
      who_we_are_heading: field(key: "who_we_are_heading") { value }
      who_we_are_paragraph_1: field(key: "who_we_are_paragraph_1") { value }
      who_we_are_paragraph_2: field(key: "who_we_are_paragraph_2") { value }
      who_we_are_button_text: field(key: "who_we_are_button_text") { value }
      
      # Commitments Text
      commitments_title: field(key: "commitments_title") { value }
      commitments_subtitle: field(key: "commitments_subtitle") { value }
      
      # AODA Card
      aoda_title: field(key: "aoda_title") { value }
      aoda_paragraph_1: field(key: "aoda_paragraph_1") { value }
      aoda_paragraph_2: field(key: "aoda_paragraph_2") { value }
      aoda_contact_label: field(key: "aoda_contact_label") { value }
      aoda_email: field(key: "aoda_email") { value }
      
      # Land Acknowledgement Card
      land_ack_title: field(key: "land_ack_title") { value }
      land_ack_paragraph_1: field(key: "land_ack_paragraph_1") { value }
      land_ack_paragraph_2: field(key: "land_ack_paragraph_2") { value }
      land_ack_paragraph_3: field(key: "land_ack_paragraph_3") { value }
    }
  }
`;


export const getHowItWorksPageQuery = /* GraphQL */ `
  query getHowItWorksPage($handle: String!) {
    metaobject(handle: {handle: $handle, type: "how_it_works_page"}) {
      # Hero & Intro
      hero_title: field(key: "hero_title") { value }
      hero_image: field(key: "hero_image") { reference { ... on MediaImage { image { url altText } } } }
      intro_heading: field(key: "intro_heading") { value }
      intro_paragraph: field(key: "intro_paragraph") { value }
      
      # Step 1
      step_1_title: field(key: "step_1_title") { value }
      step_1_description: field(key: "step_1_description") { value }
      step_1_image: field(key: "step_1_image") { reference { ... on MediaImage { image { url altText } } } }
      
      # Step 2
      step_2_title: field(key: "step_2_title") { value }
      step_2_description: field(key: "step_2_description") { value }
      step_2_image: field(key: "step_2_image") { reference { ... on MediaImage { image { url altText } } } }
      
      # Step 3
      step_3_title: field(key: "step_3_title") { value }
      step_3_description: field(key: "step_3_description") { value }
      step_3_image: field(key: "step_3_image") { reference { ... on MediaImage { image { url altText } } } }
    }
  }
`;


export const getFaqSectionQuery = /* GraphQL */ `
  query getFaqSection($handle: String!) {
    metaobject(handle: {handle: $handle, type: "faq_section"}) {
      header_text: field(key: "header_text") { value }
      header_highlight: field(key: "header_highlight") { value }
      subheading: field(key: "subheading") { value }
      support_title: field(key: "support_title") { value }
      support_description: field(key: "support_description") { value }
      support_button_text: field(key: "support_button_text") { value }
      support_button_link: field(key: "support_button_link") { value }
      
      # Fetch the list of linked FAQ Items
      faqs: field(key: "faqs") {
        references(first: 50) {
          edges {
            node {
              ... on Metaobject {
                question: field(key: "question") { value }
                answer: field(key: "answer") { value }
              }
            }
          }
        }
      }
    }
  }
`;


export const getHelpCenterPageQuery = /* GraphQL */ `
  query getHelpCenterPage($handle: String!) {
    metaobject(handle: {handle: $handle, type: "help_center_page"}) {
      hero_title: field(key: "hero_title") { value }
      hero_description: field(key: "hero_description") { value }
      contact_title: field(key: "contact_title") { value }
      email: field(key: "email") { value }
      chat_text: field(key: "chat_text") { value }
      form_title: field(key: "form_title") { value }
      success_message: field(key: "success_message") { value }
    }
  }
`;

export const getShippingPageQuery = /* GraphQL */ `
  query getShippingPage($handle: String!) {
    metaobject(handle: {handle: $handle, type: "shipping_page"}) {
      hero_title: field(key: "hero_title") { value }
      hero_image: field(key: "hero_image") { reference { ... on MediaImage { image { url } } } }
      
      card_1_title: field(key: "card_1_title") { value }
      card_1_text: field(key: "card_1_text") { value }
      card_2_title: field(key: "card_2_title") { value }
      card_2_text: field(key: "card_2_text") { value }
      card_3_title: field(key: "card_3_title") { value }
      card_3_text: field(key: "card_3_text") { value }
      
      policies_header: field(key: "policies_header") { value }
      
      policy_blocks: field(key: "policy_blocks") {
        references(first: 10) {
          edges {
            node {
              ... on Metaobject {
                title: field(key: "title") { value }
                content: field(key: "content") { value }
                highlight_note: field(key: "highlight_note") { value }
              }
            }
          }
        }
      }
      
      cta_title: field(key: "cta_title") { value }
      cta_text: field(key: "cta_text") { value }
      cta_button_text: field(key: "cta_button_text") { value }
      cta_link: field(key: "cta_link") { value }
    }
  }
`;

export const getReturnsPageQuery = /* GraphQL */ `
  query getReturnsPage($handle: String!) {
    metaobject(handle: {handle: $handle, type: "returns_page"}) {
      hero_title: field(key: "hero_title") { value }
      hero_image: field(key: "hero_image") { reference { ... on MediaImage { image { url } } } }
      hero_mobile_image: field(key: "hero_mobile_image") { reference { ... on MediaImage { image { url } } } }
      hero_text_color: field(key: "hero_text_color") { value }

      card_1_title: field(key: "card_1_title") { value }
      card_1_text: field(key: "card_1_text") { value }
      card_2_title: field(key: "card_2_title") { value }
      card_2_text: field(key: "card_2_text") { value }
      card_3_title: field(key: "card_3_title") { value }
      card_3_text: field(key: "card_3_text") { value }

      policy_title: field(key: "policy_title") { value }
      policy_p1: field(key: "policy_p1") { value }
      policy_p2: field(key: "policy_p2") { value }
      policy_p3: field(key: "policy_p3") { value }
      policy_note: field(key: "policy_note") { value }

      issues_title: field(key: "issues_title") { value }
      issues_intro: field(key: "issues_intro") { value }
      issues_email_heading: field(key: "issues_email_heading") { value }
      issues_email_text: field(key: "issues_email_text") { value }
      issues_email_address: field(key: "issues_email_address") { value }
      issues_list_1: field(key: "issues_list_1") { value }
      issues_list_2: field(key: "issues_list_2") { value }
      issues_list_3: field(key: "issues_list_3") { value }
      issues_outro: field(key: "issues_outro") { value }

      payment_title: field(key: "payment_title") { value }
      payment_intro: field(key: "payment_intro") { value }
      payment_item_1_title: field(key: "payment_item_1_title") { value }
      payment_item_1_text: field(key: "payment_item_1_text") { value }
      payment_item_2_title: field(key: "payment_item_2_title") { value }
      payment_item_2_text: field(key: "payment_item_2_text") { value }
      payment_item_3_title: field(key: "payment_item_3_title") { value }
      payment_item_3_text: field(key: "payment_item_3_text") { value }
      payment_item_4_title: field(key: "payment_item_4_title") { value }
      payment_item_4_text: field(key: "payment_item_4_text") { value }

      charges_title: field(key: "charges_title") { value }
      charges_section_1_content: field(key: "charges_section_1_content") { value }
      charges_section_2_content: field(key: "charges_section_2_content") { value }
    }
  }
`;

export const getGlobalSettingsQuery = /* GraphQL */ `
  query getGlobalSettings {
    metaobject(handle: {handle: "global-settings", type: "header_and_footer"}) {
      header_logo: field(key: "header_logo") { reference { ... on MediaImage { image { url } } } }
      footer_logo: field(key: "footer_logo") { reference { ... on MediaImage { image { url } } } }
      splash_logo: field(key: "splash_logo") { reference { ... on MediaImage { image { url } } } }
      splash_left_image: field(key: "splash_left_image") { reference { ... on MediaImage { image { url } } } }
      splash_right_image: field(key: "splash_right_image") { reference { ... on MediaImage { image { url } } } }
      
      instagram_link: field(key: "instagram_link") { value }
      facebook_link: field(key: "facebook_link") { value }
      twitter_link: field(key: "twitter_link") { value }
      youtube_link: field(key: "youtube_link") { value }
    }
  }
`;

export const getHomeFeatureSectionQuery = /* GraphQL */ `
  query getHomeFeatureSection($handle: String!) {
    metaobject(handle: {handle: $handle, type: "home_feature_section"}) {
      header_title_1: field(key: "header_title_1") { value }
      header_title_2: field(key: "header_title_2") { value }
      header_description: field(key: "header_description") { value }
      
      image_1: field(key: "image_1") { reference { ... on MediaImage { image { url } } } }
      
      card_1_title: field(key: "card_1_title") { value }
      card_1_text: field(key: "card_1_text") { value }
      card_1_button_text: field(key: "card_1_button_text") { value }
      card_1_link: field(key: "card_1_link") { value }
      
      card_2_title: field(key: "card_2_title") { value }
      card_2_text: field(key: "card_2_text") { value }
      card_2_button_text: field(key: "card_2_button_text") { value }
      card_2_link: field(key: "card_2_link") { value }
      
      image_2: field(key: "image_2") { reference { ... on MediaImage { image { url } } } }
    }
  }
`;

export const getHomeFreeGiftSectionQuery = /* GraphQL */ `
  query getHomeFreeGiftSection($handle: String!) {
    metaobject(handle: {handle: $handle, type: "home_free_gift_section"}) {
      header_title: field(key: "header_title") { value }
      header_description: field(key: "header_description") { value }
      header_subtext: field(key: "header_subtext") { value }
      
      image: field(key: "image") { reference { ... on MediaImage { image { url } } } }
      
      card_title: field(key: "card_title") { value }
      card_text: field(key: "card_text") { value }
      button_text: field(key: "button_text") { value }
      button_link: field(key: "button_link") { value }
    }
  }
`;

// --- ADD TO BOTTOM OF queries.ts ---

export const getBlogArticlesQuery = /* GraphQL */ `
  query getBlogArticles($blogHandle: String!) {
    blog(handle: $blogHandle) {
      title
      seo {
        title
        description
      }
      articles(first: 20) {
        edges {
          node {
            id
            title
            handle
            publishedAt
            excerptHtml
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

export const getArticleByHandleQuery = /* GraphQL */ `
  query getArticleByHandle($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        id
        title
        publishedAt
        contentHtml
        seo {
          title
          description
        }
        image {
          url
          altText
          width
          height
        }
        authorV2 {
          name
        }
      }
    }
  }
`;

export const getBlogsQuery = /* GraphQL */ `
  query getBlogs {
    blogs(first: 10) {
      edges {
        node {
          id
          handle
          title
          seo {
            title
            description
          }
        }
      }
    }
  }
`;

export const getMenuQuery = /* GraphQL */ `
  query getMenu($handle: String!) {
    menu(handle: $handle) {
      id
      title
      items {
        id
        title
        url
        type
        items {
          id
          title
          url
          type
          items {
            id
            title
            url
            type
          }
        }
      }
    }
  }
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $first: Int!
    $after: String
  ) {
    collection(handle: $handle) {
      image {
        url
        altText
        width
        height
      }
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`;