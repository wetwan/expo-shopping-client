import * as UiReact from "tinybase/ui-react/with-schemas";
import { Content, MergeableStore, OptionalSchemas } from "tinybase/with-schemas";
import { createClientPersister } from "./createClientPersister";

export function useCreateClientPersisterAndStart<Schemas extends OptionalSchemas>(
  storeId: string,
  store: MergeableStore<Schemas>,
  initialValues?: string,
  then?: () => void
) {
  return (UiReact as UiReact.WithSchemas<Schemas>).useCreatePersister(
    store,
    // Always receive a MergeableStore here
    (store) => createClientPersister(storeId, store as MergeableStore<Schemas>),
    [storeId],
    async (persister) => {
      // Try to parse initialValues if present
      let content: Content<Schemas> | undefined;
      if (initialValues) {
        try {
          content = [{}, JSON.parse(initialValues)];
        } catch {}
      }

      await persister.load(content);
      await persister.startAutoSave();
      then?.();
    },
    [initialValues]
  );
}
