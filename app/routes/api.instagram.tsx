import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';

export async function loader({ context }: LoaderFunctionArgs) {
  const accessToken = context.env?.INSTAGRAM_ACCESS_TOKEN;
  const limit = 6; 

  if (!accessToken) {
    return Response.json({ error: 'Token missing' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_url,permalink&access_token=${accessToken}&limit=${limit}`
    );

    if (!response.ok) {
      // ADD THIS: Read and log Meta's exact response payload
      const errorJson = await response.json();
      console.error("❌ RAW INSTAGRAM ERROR PAYLOAD:", JSON.stringify(errorJson, null, 2));
      
      return Response.json(errorJson, { status: response.status });
    }

    return await response.json();
  } catch (error) {
    console.error("❌ RAW INSTAGRAM ERROR:", (error as Error).message);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}