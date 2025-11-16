import countries from './data/countries';
import countriesMinimal from './data/countries-minimal';
import type {
    Country as CountryType,
    CountryCode,
    CountryCurrencyCode,
    CountryKeys,
    CountryMinimal,
    CountryMinimalKeys,
    CountryTimezone,
    MyCountry,
    CountryCurrency,
    CountryName,
    CountryNativeName,
    CountryNativeNames,
} from './data/country';

type GetAllOptions = {
    includedCodes?: Array<CountryCode>;
    excludedCodes?: Array<CountryCode>;
};

type SearchOptions = {
    search?: string;
    q?: string;
    dialCode?: string;
    countryCode?: CountryCode;
};

type GetOneOptions = {
    id?: number;
    code?: CountryCode;
    timezone?: CountryTimezone;
    currency?: CountryCurrencyCode;
};

type PaginationOptions = {
    page?: number;
    limit?: number;
    search?: string;
    q?: string;
    select?: Array<CountryKeys>;
    baseUrl?: string;
    sortBy?: CountryMinimalKeys;
    sortOrder?: 'asc' | 'desc';
};

type PaginationOptionsMinimal = {
    page?: number;
    limit?: number;
    search?: string;
    q?: string;
    select?: Array<CountryMinimalKeys>;
    baseUrl?: string;
    sortBy?: CountryMinimalKeys;
    sortOrder?: 'asc' | 'desc';
};

type PaginationResult<T = CountryType | CountryMinimal> = {
    data: Array<T>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    currentPage: number;
    currentUrl: string;
    nextUrl: string | null;
    previousUrl: string | null;
    lastUrl: string | null;
    from: number;
    to: number;
    currentTotal: number;
};

export class Utils {
    public static isEmpty<T = any>(value: any): boolean {
        if (Array.isArray(value) && value.length === 0) return true;
        if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return true;
        return value === null || value === undefined;
    }

    public static isNotEmpty<T = any>(value: T): boolean {
        return !this.isEmpty(value);
    }
}

export class Countries {
    // for full country data
    public static getAll({ includedCodes, excludedCodes }: GetAllOptions = {}): Array<CountryType> {
        const isEmptyIncludedCodes = Utils.isEmpty<Array<CountryCode>>(includedCodes);
        const isEmptyExcludedCodes = Utils.isEmpty<Array<CountryCode>>(excludedCodes);

        if (!isEmptyIncludedCodes && !isEmptyExcludedCodes) {
            return countries.filter(
                (country) => includedCodes!.includes(country.code) && !excludedCodes!.includes(country.code),
            );
        }
        if (!isEmptyIncludedCodes) {
            return countries.filter((country) => includedCodes!.includes(country.code));
        }
        if (!isEmptyExcludedCodes) {
            return countries.filter((country) => !excludedCodes!.includes(country.code));
        }
        return countries;
    }

    // for minimal country data
    public static getAllMinimal({ includedCodes, excludedCodes }: GetAllOptions = {}): Array<CountryMinimal> {
        const isEmptyIncludedCodes = Utils.isEmpty<Array<CountryCode>>(includedCodes);
        const isEmptyExcludedCodes = Utils.isEmpty<Array<CountryCode>>(excludedCodes);

        if (!isEmptyIncludedCodes && !isEmptyExcludedCodes) {
            return countriesMinimal.filter(
                (country) => includedCodes!.includes(country.code) && !excludedCodes!.includes(country.code),
            );
        }
        if (!isEmptyIncludedCodes) {
            return countriesMinimal.filter((country) => includedCodes!.includes(country.code));
        }
        if (!isEmptyExcludedCodes) {
            return countriesMinimal.filter((country) => !excludedCodes!.includes(country.code));
        }
        return countriesMinimal;
    }

    // for searching country data
    public static search(query: SearchOptions = {}): Array<CountryType> {
        return this.searchByRawString<Array<CountryType>>(countries, query);
    }

    public static searchMinimal(query: SearchOptions = {}): Array<CountryMinimal> {
        return this.searchByRawString<Array<CountryMinimal>>(countriesMinimal, query);
    }

    // helper function to search by raw string
    protected static searchByRawString<T extends Array<CountryType> | Array<CountryMinimal>>(
        data: T,
        { search, q, dialCode: dialCodeSearch, countryCode }: SearchOptions = {},
    ): T {
        const searchQuery = String(search || q).toLowerCase();

        if (dialCodeSearch) {
            return data.filter((country) => country.dialCode === dialCodeSearch) as T;
        }
        if (countryCode) {
            return data.filter((country) => country.code === countryCode) as T;
        }

        return data.filter((country) => {
            const title = country.title.toLowerCase();
            const code = country.code.toLowerCase();
            const dialCode = country.dialCode.toLowerCase();
            const continent = country.continent.toLowerCase();

            if (
                title.startsWith(searchQuery) ||
                title.includes(searchQuery) ||
                title.endsWith(searchQuery) ||
                title === searchQuery
            )
                return true;
            if (
                code.startsWith(searchQuery) ||
                code.includes(searchQuery) ||
                code.endsWith(searchQuery) ||
                code === searchQuery
            )
                return true;
            if (
                dialCode.startsWith(searchQuery) ||
                dialCode.includes(searchQuery) ||
                dialCode.endsWith(searchQuery) ||
                dialCode === searchQuery
            )
                return true;
            if (
                continent.startsWith(searchQuery) ||
                continent.includes(searchQuery) ||
                continent.endsWith(searchQuery) ||
                continent === searchQuery
            )
                return true;
            return false;
        }) as T;
    }

    // helper function to get one country data by raw string
    private static getOneRaw<T extends Array<CountryType> | Array<CountryMinimal>>(
        data: T,
        { code, id, timezone, currency }: GetOneOptions = {},
    ): T[number] | null {
        return (
            data.find((country) => {
                if (id) return country.id === id;
                if (code) return country.code === code;
                if (timezone) return country.timezone === timezone;
                if (currency) return country.currency === currency;
                return false;
            }) || null
        );
    }

    // for getting one country data
    public static getOne({ code, id, timezone, currency }: GetOneOptions = {}): CountryType | null {
        return this.getOneRaw<Array<CountryType>>(countries, { code, id, timezone, currency });
    }

    public static getOneMinimal({ code, id, timezone, currency }: GetOneOptions = {}): CountryMinimal | null {
        return this.getOneRaw<Array<CountryMinimal>>(countriesMinimal, { code, id, timezone, currency });
    }

    // helper function to paginate country data
    private static paginateRaw<T extends Array<CountryType> | Array<CountryMinimal>>(
        data: T,
        { page = 1, limit = 10, search, q, select, baseUrl, sortBy, sortOrder = 'asc' }: PaginationOptions = {},
    ): PaginationResult<T[number]> {
        // Apply search filter if provided
        let filteredData = data;
        if (search || q) {
            filteredData = this.searchByRawString<T>(data, { search, q });
        }

        // Apply sorting if provided
        if (sortBy) {
            filteredData = [...filteredData].sort((a, b) => {
                const aValue = a[sortBy];
                const bValue = b[sortBy];

                // Handle different value types
                let comparison = 0;
                if (aValue === bValue) {
                    comparison = 0;
                } else if (aValue === null || aValue === undefined) {
                    comparison = 1;
                } else if (bValue === null || bValue === undefined) {
                    comparison = -1;
                } else if (typeof aValue === 'string' && typeof bValue === 'string') {
                    comparison = aValue.localeCompare(bValue);
                } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                    comparison = aValue - bValue;
                } else {
                    comparison = String(aValue).localeCompare(String(bValue));
                }

                return sortOrder === 'asc' ? comparison : -comparison;
            }) as T;
        }

        // Apply field selection if provided
        let processedData = filteredData;
        if (select && select.length > 0) {
            processedData = filteredData.map((country) => {
                const selected: Partial<T[number]> = {};
                select.forEach((key) => {
                    if (key in country) {
                        (selected as any)[key] = (country as any)[key];
                    }
                });
                return selected as T[number];
            }) as T;
        }

        // Calculate pagination metadata
        const total = processedData.length;
        const totalPages = Math.ceil(total / limit);
        const currentPage = Math.max(1, Math.min(page, totalPages));
        const startIndex = (currentPage - 1) * limit;
        const endIndex = Math.min(startIndex + limit, total);
        const paginatedData = processedData.slice(startIndex, endIndex) as Array<T[number]>;

        // Calculate from/to
        const from = total > 0 ? startIndex + 1 : 0;
        const to = Math.min(endIndex, total);

        // Generate URLs if baseUrl is provided
        const generateUrl = (pageNum: number | null, params?: Record<string, string>): string | null => {
            if (!baseUrl || pageNum === null) return null;

            try {
                // Try to parse as absolute URL first
                const url =
                    baseUrl.startsWith('http://') || baseUrl.startsWith('https://')
                        ? new URL(baseUrl)
                        : new URL(baseUrl, 'http://localhost');

                url.searchParams.set('page', String(pageNum));
                if (limit !== 10) url.searchParams.set('limit', String(limit));
                if (search || q) url.searchParams.set('q', String(search || q));
                if (sortBy) url.searchParams.set('sortBy', sortBy);
                if (sortOrder && sortOrder !== 'asc') url.searchParams.set('sortOrder', sortOrder);
                if (select && select.length > 0) url.searchParams.set('select', select.join(','));
                if (params) {
                    Object.entries(params).forEach(([key, value]) => {
                        url.searchParams.set(key, value);
                    });
                }

                // Return relative URL (pathname + search) for relative baseUrl, full URL for absolute
                if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
                    return url.toString();
                }
                return url.pathname + url.search;
            } catch {
                // Fallback: simple query string building for relative URLs
                const params = new URLSearchParams();
                params.set('page', String(pageNum));
                if (limit !== 10) params.set('limit', String(limit));
                if (search || q) params.set('q', String(search || q));
                if (sortBy) params.set('sortBy', sortBy);
                if (sortOrder && sortOrder !== 'asc') params.set('sortOrder', sortOrder);
                if (select && select.length > 0) params.set('select', select.join(','));

                const separator = baseUrl.includes('?') ? '&' : '?';
                return baseUrl + separator + params.toString();
            }
        };

        // Generate pagination links
        const links: Array<{ url: string | null; label: string; active: boolean }> = [];

        // Previous link
        links.push({
            url: generateUrl(currentPage > 1 ? currentPage - 1 : null),
            label: 'Previous',
            active: false,
        });

        // Calculate first 3 pages and last 3 pages
        const firstPages = totalPages >= 3 ? [1, 2, 3] : Array.from({ length: totalPages }, (_, i) => i + 1);
        const lastPages = totalPages >= 3 ? [totalPages - 2, totalPages - 1, totalPages] : [];

        // Calculate pages around current (current-1, current, current+1)
        const pagesAroundCurrent: number[] = [];
        if (currentPage > 1) {
            pagesAroundCurrent.push(currentPage - 1);
        }

        pagesAroundCurrent.push(currentPage);
        if (currentPage < totalPages) {
            pagesAroundCurrent.push(currentPage + 1);
        }

        // Determine which pages to show in each section
        const pagesToShowInMiddle = pagesAroundCurrent.filter(
            (page) => !firstPages.includes(page) && !lastPages.includes(page),
        );

        // Add first 3 pages (skip if already shown in middle section)
        firstPages.forEach((page) => {
            if (!pagesToShowInMiddle.includes(page)) {
                links.push({
                    url: generateUrl(page),
                    label: String(page),
                    active: page === currentPage,
                });
            }
        });

        // Add ellipsis if there's a gap between first pages and middle section
        if (pagesToShowInMiddle.length > 0) {
            const minMiddlePage = Math.min(...pagesToShowInMiddle);
            const maxFirstPage = Math.max(...firstPages);
            if (minMiddlePage - maxFirstPage > 1) {
                links.push({
                    url: null,
                    label: '...',
                    active: false,
                });
            }
        }

        // Add pages around current in the middle section
        pagesToShowInMiddle.forEach((page) => {
            links.push({
                url: generateUrl(page),
                label: String(page),
                active: page === currentPage,
            });
        });

        // Add ellipsis if there's a gap between middle section and last pages
        if (lastPages.length > 0) {
            const minLastPage = Math.min(...lastPages);
            if (pagesToShowInMiddle.length > 0) {
                const maxMiddlePage = Math.max(...pagesToShowInMiddle);
                if (minLastPage - maxMiddlePage > 1) {
                    links.push({
                        url: null,
                        label: '...',
                        active: false,
                    });
                }
            } else {
                const maxFirstPage = Math.max(...firstPages);
                if (minLastPage - maxFirstPage > 1) {
                    links.push({
                        url: null,
                        label: '...',
                        active: false,
                    });
                }
            }
        }

        // Add last 3 pages (skip if already shown in first or middle section)
        lastPages.forEach((page) => {
            if (!firstPages.includes(page) && !pagesToShowInMiddle.includes(page)) {
                links.push({
                    url: generateUrl(page),
                    label: String(page),
                    active: page === currentPage,
                });
            }
        });

        // Next link
        links.push({
            url: generateUrl(currentPage < totalPages ? currentPage + 1 : null),
            label: 'Next',
            active: false,
        });

        return {
            data: paginatedData,
            total,
            page: currentPage,
            limit,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1,
            links,
            currentPage,
            currentUrl: generateUrl(currentPage) || '',
            nextUrl: generateUrl(currentPage < totalPages ? currentPage + 1 : null),
            previousUrl: generateUrl(currentPage > 1 ? currentPage - 1 : null),
            lastUrl: generateUrl(totalPages > 0 ? totalPages : null),
            from,
            to,
            currentTotal: paginatedData.length,
        };
    }

    // for paginating country data
    public static paginate({
        page,
        limit,
        search,
        q,
        select,
        baseUrl,
        sortBy,
        sortOrder,
    }: PaginationOptions = {}): PaginationResult<CountryType> {
        return this.paginateRaw<Array<CountryType>>(countries, {
            page,
            limit,
            search,
            q,
            select,
            baseUrl,
            sortBy,
            sortOrder,
        });
    }

    public static paginateMinimal({
        page,
        limit,
        search,
        q,
        select,
        baseUrl,
        sortBy,
        sortOrder,
    }: PaginationOptionsMinimal = {}): PaginationResult<CountryMinimal> {
        return this.paginateRaw<Array<CountryMinimal>>(countriesMinimal, {
            page,
            limit,
            search,
            q,
            select,
            baseUrl,
            sortBy,
            sortOrder,
        });
    }

    // get my country data
    public static async findMyCountry(): Promise<{ data: MyCountry | null; error?: string }> {
        try {
            const response = await fetch('https://ipwho.is', { headers: { Accept: 'application/json' } });
            const data = (await response.json()) as MyCountry;

            return { data };
        } catch (e) {
            const error = e instanceof Error ? e.message : 'Unknown error! Failed to get my country!';
            return await Promise.resolve({ data: null, error });
        }
    }
}

export default class Country extends Countries {
    private limit: number = 10;
    private page: number = 1;
    private search: string = '';
    private q: string = '';
    private select: Array<CountryKeys> = [];
    private baseUrl: string = '';
    private sortBy: CountryMinimalKeys = 'id';
    private sortOrder: 'asc' | 'desc' = 'asc';
    private includedCodes: Array<CountryCode> = [];
    private excludedCodes: Array<CountryCode> = [];
    private selectedCountryCode: CountryCode | null = null;
    private myCountry: MyCountry | null = null;
    private myCountryError: string | null = null;
    private selectedCountry: CountryType | null = null;

    constructor(selectedCountryCode: CountryCode | null = 'US', callGetMyCountry: boolean = false) {
        super();
        this.selectedCountryCode = selectedCountryCode;
        if (selectedCountryCode) this.selectedCountry = Countries.getOne({ code: selectedCountryCode }) || null;

        // get my country data if callGetMyCountry is true
        if (callGetMyCountry) {
            Countries.findMyCountry()
                .then((myCountry) => {
                    if (this.selectedCountryCode) {
                        this.selectedCountry = Countries.getOne({
                            code: myCountry.data?.country_code || this.selectedCountryCode,
                        });
                    }
                    this.myCountry = myCountry.data || null;
                    this.myCountryError = myCountry.error || null;
                })
                .catch((error) => {
                    this.myCountryError =
                        error instanceof Error ? error.message : 'Unknown error! Failed to get my country!';
                });
        }
    }

    // set my country data
    public async setMyCountry(): Promise<this> {
        try {
            const myCountry = await Countries.findMyCountry();
            this.myCountry = myCountry.data;
            this.myCountryError = myCountry.error || null;
            this.selectedCountryCode = this.myCountry?.country_code || null;

            if (this.selectedCountryCode) {
                this.selectedCountry = Countries.getOne({
                    code: this.selectedCountryCode,
                });
            }
        } catch (error) {
            this.myCountryError = error instanceof Error ? error.message : 'Unknown error! Failed to get my country!';
        }

        return await Promise.resolve(this);
    }

    public getSearchQuery(): string {
        return String(this.search || this.q || '');
    }

    public setSelectedCountry(selectedCountry: CountryType): this {
        this.selectedCountry = selectedCountry;
        return this;
    }

    public setSelectedCountryCode(selectedCountryCode?: CountryCode | null): this {
        if (!selectedCountryCode) return this;

        this.selectedCountryCode = selectedCountryCode;
        this.selectedCountry = Countries.getOne({ code: selectedCountryCode });
        return this;
    }

    public setSelectedCountryByFind(query?: SearchOptions | string | null): this {
        if (!query) return this;

        if (typeof query === 'string') {
            const result = Countries.search({ search: query });
            this.selectedCountry = result?.[0] || null;
        } else {
            const result = Countries.search(query);
            this.selectedCountry = result?.[0] || null;
        }
        return this;
    }

    public setLimit(limit: number): this {
        this.limit = limit;
        return this;
    }

    public setPage(page: number): this {
        this.page = page;
        return this;
    }

    public setSearch(search: string): this {
        this.search = search;
        return this;
    }

    public setQ(q: string): this {
        this.q = q;
        return this;
    }

    public setSelect(select: Array<CountryKeys>): this {
        this.select = select;
        return this;
    }

    public setBaseUrl(baseUrl: string): this {
        this.baseUrl = baseUrl;
        return this;
    }

    public setSortBy(sortBy: CountryMinimalKeys): this {
        this.sortBy = sortBy;
        return this;
    }

    public setSortOrder(sortOrder: 'asc' | 'desc'): this {
        this.sortOrder = sortOrder;
        return this;
    }

    public setIncludedCodes(includedCodes: Array<CountryCode>): this {
        this.includedCodes = includedCodes;
        return this;
    }

    public setExcludedCodes(excludedCodes: Array<CountryCode>): this {
        this.excludedCodes = excludedCodes;
        return this;
    }

    // getter functions
    public getMyCountry(): MyCountry | null {
        return this.myCountry;
    }

    public getMyCountryError(): string | null {
        return this.myCountryError;
    }

    public getCountry(): CountryType | null {
        return this.selectedCountry;
    }

    public getCountryMinimal(): CountryMinimal | null {
        if (this.selectedCountry) {
            return {
                id: this.selectedCountry.id,
                code: this.selectedCountry.code,
                title: this.selectedCountry.title,
                dialCode: this.selectedCountry.dialCode,
                continent: this.selectedCountry.continent,
                active: this.selectedCountry.active,
                capital: this.selectedCountry.capital,
                unicode: this.selectedCountry.unicode,
                emoji: this.selectedCountry.emoji,
                timezone: this.selectedCountry.timezone,
                currency: this.selectedCountry.currency,
                currencySymbol: this.selectedCountry.currencySymbol,
            };
        }

        return null;
    }

    public getCountryCode(): CountryCode | null {
        return this.selectedCountry?.code || null;
    }

    public getCountryTitle(): string | null {
        return this.selectedCountry?.title || null;
    }

    public getCountryDialCode(): string | null {
        return this.selectedCountry?.dialCode || null;
    }

    public getCountryContinent(): string | null {
        return this.selectedCountry?.continent || null;
    }

    public getCountryFlag(): string | null {
        return this.selectedCountry?.flag || null;
    }

    public getCountryLargeFlag(): string | null {
        return this.selectedCountry?.largeFlag || null;
    }

    public getCountryUnicode(): string | null {
        return this.selectedCountry?.unicode || null;
    }

    public getCountryEmoji(): string | null {
        return this.selectedCountry?.emoji || null;
    }

    public getCountryTimezone(): string | null {
        return this.selectedCountry?.timezone || null;
    }

    public getCountryCurrency(): string | null {
        return this.selectedCountry?.currency || null;
    }

    public getCountryCurrencySymbol(): string | null {
        return this.selectedCountry?.currencySymbol || null;
    }

    public getCountryTimezones(): Array<string> | null {
        return this.selectedCountry?.timezones || null;
    }

    public getCountryCurrencies(): CountryCurrency | null {
        return this.selectedCountry?.currencies || null;
    }

    public getCountryName(): CountryName | null {
        return this.selectedCountry?.name || null;
    }

    public getCountryNativeNames(): Array<CountryNativeNames> | null {
        return this.selectedCountry?.nativeNames || null;
    }

    // get All, paginate
    public getAllCountries(): Array<CountryType> {
        const result = Countries.getAll({ includedCodes: this.includedCodes, excludedCodes: this.excludedCodes });
        return Countries.searchByRawString<Array<CountryType>>(result, { search: this.search, q: this.q });
    }

    public getPaginateCountries(): PaginationResult<CountryType> {
        return Countries.paginate({
            page: this.page,
            limit: this.limit,
            search: this.search,
            q: this.q,
            select: this.select,
            baseUrl: this.baseUrl,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder,
        });
    }

    public getSearchCountries(): Array<CountryType> {
        return Countries.search({ search: this.search, q: this.q });
    }

    public getSearchCountriesMinimal(): Array<CountryMinimal> {
        return Countries.searchMinimal({ search: this.search, q: this.q });
    }

    // for getting all countries minimal
    public getAllCountriesMinimal(): Array<CountryMinimal> {
        const result = Countries.getAllMinimal({
            includedCodes: this.includedCodes,
            excludedCodes: this.excludedCodes,
        });
        return Countries.searchByRawString<Array<CountryMinimal>>(result, { search: this.search, q: this.q });
    }

    public getPaginateCountriesMinimal(): PaginationResult<CountryMinimal> {
        const select: Array<CountryMinimalKeys> = this.select.filter((key) =>
            Object.keys(countriesMinimal[0]).includes(key),
        ) as Array<CountryMinimalKeys>;

        return Countries.paginateMinimal({
            page: this.page,
            limit: this.limit,
            search: this.search,
            q: this.q,
            select,
            baseUrl: this.baseUrl,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder,
        });
    }
}
