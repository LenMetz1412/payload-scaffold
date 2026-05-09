import type { Field } from "payload";

import type { CollectionSlugs } from "@/config/collections";
import { locales } from "@/config/locales";

import { slugField } from "./slug";

export const getBaseDocumentFields = (collection: CollectionSlugs): Field[] => [
  {
    name: "title",
    type: "text",
    localized: true,
    required: true,
    index: true,
    hooks: {
      beforeDuplicate: [
        ({ value }) => {
          if (value && typeof value === "object" && !Array.isArray(value)) {
            const input = value as Record<string, string | undefined>;
            const output: Record<string, string> = {};
            for (const l of locales) {
              const v = input[l] || "";
              output[l] = v ? `${v} - Copy` : "";
            }
            return output;
          }
          if (typeof value === "string") {
            return value ? `${value} - Copy` : value;
          }
          return value;
        },
      ],
    },
  },
  {
    name: "description",
    label: {
      en: "Description",
      de: "Beschreibung",
    },
    type: "textarea",
    localized: true,
  },
  ...slugField("title", { collectionForUniqueness: collection }),
  // {
  //   name: 'updatedBy',
  //   type: 'relationship',
  //   relationTo: 'users',
  //   access: {
  //     // Prevent users from updating the 'updatedBy' field directly.
  //     // This field is intended to be set automatically by hooks.
  //     update: () => false,
  //   },
  //   admin: {
  //     readOnly: true,
  //     allowEdit: false,
  //     appearance: 'drawer',
  //     position: 'sidebar',
  //     condition: (data) => !!data?.updatedBy,
  //   },
  // },
  {
    name: "collectionSlug",
    type: "text",
    defaultValue: collection,
    admin: {
      condition: () => false,
    },
  },
];
