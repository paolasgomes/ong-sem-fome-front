import type { Family } from "../types/Family";

export const formatFamilyPayload = (family: Family) => {
    return {
        responsible_name: family.responsible_name,
        responsible_cpf: family.responsible_cpf.replace(/\D/g, ""),
        street_number: family.street_number,
        street_complement: family.street_complement,
        street_neighborhood: family.street_neighborhood,
        city: family.city,
        state: family.state,
        zip_code: family.zip_code,
        street_address: family.street_address,
        phone: family.phone.replace(/\D/g, ""),
        email: family.email,
        members_count: Number(family.members_count) || 0,
        income_bracket: family.income_bracket,
        address: `${family.street_address}, ${family.street_number}, ${family.street_neighborhood}`,
        observation: family.observation,
        is_active: family.is_active
    };
};
