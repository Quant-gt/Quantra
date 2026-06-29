import { withSupabase } from "@supabase/server"

export default {
  async fetch(request: Request, env: any, ctx: any) {
    return withSupabase({ auth: "user" }, async (req, supabaseCtx) => {
      // Fetch data from the RLS-secured table
      const { data, error } = await supabaseCtx.supabase
        .from("strategies")
        .select("*")
        .limit(10)

      if (error) {
        return Response.json({ error: error.message }, { status: 500 })
      }

      return Response.json(data)
    })(request, env, ctx)
  }
}
