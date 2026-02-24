"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { listVendorsAction } from "@/server/actions/vendor.action";
import { listTemplatesByVendorAction } from "@/server/actions/template.action";

import TemplatesScreen from "@/app/components/settings/templates/TemplateScreen";
import { Vendor } from "@/app/model/vendor";
import { Template } from "@/app/model/template";

export default function TemplatesPageClient() {
    const router = useRouter();
    const sp = useSearchParams();

    const vendorIdFromUrl = useMemo(() => {
        const raw = sp.get("vendorId");
        const n = raw ? Number(raw) : 0;
        return Number.isFinite(n) ? n : 0;
    }, [sp]);

    const [vendorList, setVendorList] = useState<Vendor[]>([]);
    const [vendorListLoading, setVendorListLoading] = useState(false);

    const [templateList, setTemplateList] = useState<Template[]>([]);
    const [pageLoading, setPageLoading] = useState(false);

    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [selectedVendorId, setSelectedVendorId] = useState<number>(vendorIdFromUrl);

    const fetchVendorList = useCallback(async () => {
        setVendorListLoading(true);
        try {
            const res = await listVendorsAction();
            setVendorList(res.ok ? res.data.vendorList || [] : []);
        } finally {
            setVendorListLoading(false);
        }
    }, []);

    const fetchTemplates = useCallback(async (vendorId: number) => {
        setPageLoading(true);
        try {
            const res = await listTemplatesByVendorAction(vendorId);
            setTemplateList(res.ok ? res.data.templates || [] : []);
        } finally {
            setPageLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVendorList();
    }, [fetchVendorList]);

    useEffect(() => {
        if (vendorList.length === 0) return;

        const urlId = vendorIdFromUrl;
        const validId = urlId && vendorList.some((v) => v.id === urlId) ? urlId : vendorList[0].id;

        if (validId !== urlId) {
            router.replace(`/settings/templates?vendorId=${validId}`);
        }

        setSelectedVendorId(validId);
        setSelectedVendor(vendorList.find((v) => v.id === validId) || null);
    }, [vendorList, vendorIdFromUrl, router]);

    useEffect(() => {
        if (!selectedVendorId) return;
        fetchTemplates(selectedVendorId);
    }, [selectedVendorId, fetchTemplates]);

    const handleChangeVendorId = useCallback(
        (nextId: number) => {
            setSelectedVendorId(nextId);
            setSelectedVendor(vendorList.find((v) => v.id === nextId) || null);
            router.replace(`/settings/templates?vendorId=${nextId}`, { scroll: false });
        },
        [vendorList, router]
    );

    const handleFetchTemplateList = () => {
        fetchTemplates(selectedVendorId);
    };

    return (
        <TemplatesScreen
            vendorList={vendorList}
            vendorListLoading={vendorListLoading}
            pageLoading={pageLoading}
            vendorId={selectedVendorId}
            vendor={selectedVendor}
            templateList={templateList}
            onChangeVendorId={handleChangeVendorId}
            onFetchTemplates={handleFetchTemplateList}
        />
    );
}