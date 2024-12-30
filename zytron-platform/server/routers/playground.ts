import { router, userProcedure } from '@/app/api/trpc/trpc-router';
import { supabaseAdmin } from '@/shared/utils/supabase/admin';
import { openagentsaiApiModel } from '@/shared/models/db-types';
import { createCallerFactory } from '@trpc/server/unstable-core-do-not-import';
import panelRouter from './panel';
import { generateApiKey } from '@/shared/utils/helpers';
const playgroundRouter = router({
  playgroundListModels: userProcedure.query(async ({ ctx }) => {
    const models = await supabaseAdmin
      .from('openagentsai_cloud_models')
      .select('*')
      .eq('enabled', true);

    return models.data?.map(
      (model) =>
        ({
          id: model.id,
          name: model.name,
          unique_name: model.unique_name,
          model_type: model.model_type,
          support_functions: model.support_functions
        }) as openagentsaiApiModel
    );
  }),
  getPlaygroundApiKey: userProcedure.query(async ({ ctx }) => {
    const currentPlaygroundApiKey = await supabaseAdmin
      .from('openagentsai_cloud_api_keys')
      .select('*')
      .eq('name', 'playground')
      .single();

    if (!currentPlaygroundApiKey?.data) {
      const user = ctx.session.data?.session?.user;
      if (!user) {
        throw new Error('User not found');
      }
      const key = generateApiKey();
      await ctx.supabase
        .from('openagentsai_cloud_api_keys')
        .insert({ name: 'playground', key, user_id: user.id });

      return key;
    }
    return currentPlaygroundApiKey.data?.key;
  })
});

export default playgroundRouter;
